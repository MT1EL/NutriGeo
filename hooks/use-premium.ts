import { getPremiumStatus } from "@/api/premium";
import { useAuth } from "@/contexts/AuthContext";
import type { PremiumStatus } from "@/api/types";
import { useQuery } from "@tanstack/react-query";

export const PREMIUM_STATUS_QUERY_KEY = ["PremiumStatus"] as const;

// Fetches and caches the user's premium entitlement. Hits the backend, which
// is the source of truth — receipt validation and entitlement state live there
// (today via `/v1/premium/status`, eventually via RevenueCat webhook → DB).
//
// Consumers should treat `isPremium` as the single gate: any feature that
// requires payment should branch on this flag, not on `product_id` or
// `expires_at` directly.
export function usePremium() {
  const { isAuthenticated } = useAuth();

  const query = useQuery<{ data: PremiumStatus }>({
    queryKey: PREMIUM_STATUS_QUERY_KEY,
    queryFn: getPremiumStatus,
    // Don't fire while logged out — there's no entitlement to fetch.
    enabled: isAuthenticated,
    // Premium state changes rarely (purchase, cancel, expiry). Refetch on
    // focus so a user who just bought a subscription on the App Store sees
    // it reflected without restarting the app.
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });

  const status = query.data?.data;

  return {
    isPremium: status?.active ?? false,
    isLoading: query.isLoading,
    status,
    refetch: query.refetch,
  };
}
