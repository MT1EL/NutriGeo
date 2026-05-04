import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Platform } from "react-native";
import en from "./locales/en.json";
import ka from "./locales/ka.json";

export const SUPPORTED_LANGUAGES = ["ka", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "ka";

const STORAGE_KEY = "forma.language";
const canPersist = Platform.OS !== "web";

function isSupported(
  code: string | null | undefined,
): code is SupportedLanguage {
  return !!code && (SUPPORTED_LANGUAGES as readonly string[]).includes(code);
}

function detectInitialLanguage(): SupportedLanguage {
  const locales = Localization.getLocales();
  const code = locales[0]?.languageCode?.toLowerCase();
  return isSupported(code) ? code : DEFAULT_LANGUAGE;
}

void i18n.use(initReactI18next).init({
  resources: {
    ka: { translation: ka },
    en: { translation: en },
  },
  lng: detectInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  // RN doesn't have Suspense for translations; render synchronously.
  react: { useSuspense: false },
});

// Hydrate the user's saved choice from SecureStore. Init runs synchronously
// against the device locale so the first render is correct; if the user
// previously picked a different language, swap to it as soon as we read it.
if (canPersist) {
  void (async () => {
    try {
      const saved = await SecureStore.getItemAsync(STORAGE_KEY);
      if (isSupported(saved) && saved !== i18n.language) {
        await i18n.changeLanguage(saved);
      }
    } catch {
      // SecureStore can fail on simulator boot; fall through to detected locale.
    }
  })();
}

// Persist every language change so the choice survives an app restart.
i18n.on("languageChanged", (lng) => {
  if (!canPersist) return;
  const code = lng?.split("-")[0];
  if (!isSupported(code)) return;
  void SecureStore.setItemAsync(STORAGE_KEY, code).catch(() => {});
});

export default i18n;
