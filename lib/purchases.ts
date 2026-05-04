import { Platform } from "react-native";
import Purchases, {
  PACKAGE_TYPE,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from "react-native-purchases";
import RevenueCatUI, {
  PAYWALL_RESULT,
} from "react-native-purchases-ui";

// Entitlement identifier configured in the RevenueCat dashboard. All paid
// features are gated by this single entitlement; product IDs can change
// without touching client code. Must match the identifier (not the display
// name) of the entitlement created in the RC dashboard.
export const PREMIUM_ENTITLEMENT_ID = "pro";

// We look up packages by their PACKAGE_TYPE rather than identifier strings.
// RC derives the type from the product's billing period (1 month → MONTHLY,
// 1 year → ANNUAL, non-consumable → LIFETIME), so this works regardless of
// how the packages are named in the dashboard.
export type PlanKind = "monthly" | "annual" | "lifetime";

const PLAN_TO_PACKAGE_TYPE: Record<PlanKind, PACKAGE_TYPE> = {
  monthly: PACKAGE_TYPE.MONTHLY,
  annual: PACKAGE_TYPE.ANNUAL,
  lifetime: PACKAGE_TYPE.LIFETIME,
};

let configured = false;

// Test/dev keys (prefixed `test_`) work cross-platform; production
// (`appl_*`, `goog_*`) are platform-specific. Resolve in priority order so
// you can drop the universal key in `.env` for early testing, then swap to
// per-platform keys for store builds via EAS env config.
function apiKeyForPlatform(): string | null {
  const universal = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
  if (universal && universal.length > 0) return universal;

  const platformKey =
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
      : Platform.OS === "android"
        ? process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
        : null;
  return platformKey && platformKey.length > 0 ? platformKey : null;
}

// Whether IAP is available on this build. Web is always false; native is
// false only when no API key is set — caller should hide buy/restore
// affordances and surface a friendlier message.
export function isPurchasesAvailable(): boolean {
  if (Platform.OS === "web") return false;
  return apiKeyForPlatform() !== null;
}

// Configure once per app process. Idempotent. Identifies the user with RC
// so purchases tie to a stable identity that survives reinstalls.
export async function configurePurchases(appUserId: string | null) {
  if (!isPurchasesAvailable()) return;
  const key = apiKeyForPlatform();
  if (!key) return;

  if (!configured) {
    Purchases.configure({ apiKey: key, appUserID: appUserId ?? undefined });
    configured = true;
    return;
  }

  // Already configured this process — keep RC's user identity in sync with
  // the auth user. logIn() merges anonymous purchases into the named user.
  if (appUserId) {
    await Purchases.logIn(appUserId);
  }
}

// Drop the RC identity on sign-out. New purchases will go to a fresh
// anonymous user until the next sign-in. Server-side webhook sees the
// transition; downstream entitlement state is rebuilt by the next /me.
export async function logoutPurchases() {
  if (!isPurchasesAvailable() || !configured) return;
  try {
    await Purchases.logOut();
  } catch {
    // RC throws when already anonymous — ignore.
  }
}

// ---- Low-level helpers (kept exported for any custom flow that bypasses
// the prebuilt RC paywall — e.g. a plan picker on a marketing page).

export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  if (!isPurchasesAvailable()) return null;
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

export function findPackage(
  offering: PurchasesOffering,
  plan: PlanKind,
): PurchasesPackage | null {
  const targetType = PLAN_TO_PACKAGE_TYPE[plan];
  return (
    offering.availablePackages.find((p) => p.packageType === targetType) ??
    null
  );
}

export async function purchasePackage(
  pkg: PurchasesPackage,
): Promise<CustomerInfo> {
  const result = await Purchases.purchasePackage(pkg);
  return result.customerInfo;
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return await Purchases.restorePurchases();
}

export function isPremiumActive(info: CustomerInfo): boolean {
  return Boolean(info.entitlements.active[PREMIUM_ENTITLEMENT_ID]);
}

// User-cancelled errors from native sheets share a stable shape. Caller
// should treat these as "no-op, no toast" — the user already saw the sheet.
export function isUserCancelledError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = err as { userCancelled?: boolean; code?: string };
  return code.userCancelled === true || code.code === "PURCHASE_CANCELLED";
}

// ---- Paywall + Customer Center (modern RC UI, recommended path).

export type PaywallOutcome =
  | "purchased"
  | "restored"
  | "cancelled"
  | "error"
  | "not_presented";

function mapPaywallResult(result: PAYWALL_RESULT): PaywallOutcome {
  switch (result) {
    case PAYWALL_RESULT.PURCHASED:
      return "purchased";
    case PAYWALL_RESULT.RESTORED:
      return "restored";
    case PAYWALL_RESULT.CANCELLED:
      return "cancelled";
    case PAYWALL_RESULT.ERROR:
      return "error";
    case PAYWALL_RESULT.NOT_PRESENTED:
    default:
      return "not_presented";
  }
}

// Show the paywall configured in the RC dashboard for the current offering.
// Returns the resolution so the caller can refresh entitlement state.
export async function presentPaywall(): Promise<PaywallOutcome> {
  if (!isPurchasesAvailable()) return "not_presented";
  const result = await RevenueCatUI.presentPaywall();
  return mapPaywallResult(result);
}

// Show the paywall ONLY if the user lacks the entitlement. Standard pattern
// for feature-gated screens — call from a button press, this resolves with
// the user already entitled, and the caller can proceed.
export async function presentPaywallIfNeeded(
  entitlementId: string = PREMIUM_ENTITLEMENT_ID,
): Promise<PaywallOutcome> {
  if (!isPurchasesAvailable()) return "not_presented";
  const result = await RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: entitlementId,
  });
  return mapPaywallResult(result);
}

// RC's prebuilt subscription management UI — replaces our deeplink to the
// App Store / Play Store subscription settings. Lets users see active subs,
// switch plans, request refunds, contact support. Apple/Google review:
// satisfies the "user must be able to manage subscription from inside the
// app" requirement without leaving the app.
export async function presentCustomerCenter(): Promise<void> {
  if (!isPurchasesAvailable()) return;
  await RevenueCatUI.presentCustomerCenter();
}
