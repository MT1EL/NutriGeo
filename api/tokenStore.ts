import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type Tokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

const ACCESS_KEY = "nutrigeo.access_token";
const REFRESH_KEY = "nutrigeo.refresh_token";

let tokens: Tokens = { accessToken: null, refreshToken: null };
let hydratePromise: Promise<Tokens> | null = null;
let hydrated = false;
const listeners = new Set<(t: Tokens) => void>();

const canPersist = Platform.OS !== "web";

async function persist(next: Tokens) {
  if (!canPersist) return;
  try {
    if (next.accessToken) {
      await SecureStore.setItemAsync(ACCESS_KEY, next.accessToken);
    } else {
      await SecureStore.deleteItemAsync(ACCESS_KEY);
    }
    if (next.refreshToken) {
      await SecureStore.setItemAsync(REFRESH_KEY, next.refreshToken);
    } else {
      await SecureStore.deleteItemAsync(REFRESH_KEY);
    }
  } catch {
    // SecureStore can fail on simulator boot; in-memory copy still works for the session.
  }
}

export function getTokens(): Tokens {
  return tokens;
}

export function setTokens(next: Partial<Tokens>) {
  tokens = { ...tokens, ...next };
  listeners.forEach((l) => l(tokens));
  void persist(tokens);
}

export function clearTokens() {
  tokens = { accessToken: null, refreshToken: null };
  listeners.forEach((l) => l(tokens));
  void persist(tokens);
}

export function hydrateTokens(): Promise<Tokens> {
  if (hydrated) return Promise.resolve(tokens);
  if (hydratePromise) return hydratePromise;

  hydratePromise = (async () => {
    if (!canPersist) {
      hydrated = true;
      return tokens;
    }
    try {
      const [accessToken, refreshToken] = await Promise.all([
        SecureStore.getItemAsync(ACCESS_KEY),
        SecureStore.getItemAsync(REFRESH_KEY),
      ]);
      tokens = { accessToken, refreshToken };
      listeners.forEach((l) => l(tokens));
    } catch {
      // ignore — keep empty in-memory tokens
    } finally {
      hydrated = true;
    }
    return tokens;
  })();

  return hydratePromise;
}

export function isHydrated() {
  return hydrated;
}
