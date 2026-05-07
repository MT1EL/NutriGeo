import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from "@/api/auth";
import { HttpError } from "@/api/client";
import { getMe } from "@/api/me";
import { clearTokens, hydrateTokens } from "@/api/tokenStore";
import type { User } from "@/api/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Status = "loading" | "authenticated" | "unauthenticated";

type FetchUserResult =
  | { ok: true; user: User }
  | { ok: false; reason: "unauthorized" | "network" };

type AuthApi = {
  status: Status;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (input: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<User | null>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthApi | null>(null);

async function loadMe(): Promise<FetchUserResult> {
  try {
    const res = await getMe();
    return { ok: true, user: res.data };
  } catch (err) {
    if (err instanceof HttpError && err.status === 401) {
      return { ok: false, reason: "unauthorized" };
    }
    return { ok: false, reason: "network" };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async (): Promise<User | null> => {
    const result = await loadMe();
    if (result.ok) {
      setUser(result.user);
      return result.user;
    }
    if (result.reason === "unauthorized") {
      clearTokens();
      setUser(null);
    }
    return null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { accessToken } = await hydrateTokens();
      if (cancelled) return;
      if (!accessToken) {
        setStatus("unauthenticated");
        return;
      }
      const result = await loadMe();
      if (cancelled) return;
      if (result.ok) {
        setUser(result.user);
        setStatus("authenticated");
      } else if (result.reason === "unauthorized") {
        clearTokens();
        setStatus("unauthenticated");
      } else {
        // Network error on bootstrap — keep the session, let next call retry.
        setStatus("authenticated");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await apiLogin({ email, password });
      const nextUser = await fetchUser();
      if (!nextUser) {
        throw new Error("Failed to load user profile");
      }
      setUser(nextUser);
      setStatus("authenticated");
      return nextUser;
    },
    [fetchUser],
  );

  const signUp = useCallback(
    async (input: { email: string; password: string; name?: string }) => {
      const result = await apiRegister(input);
      if (!result.session) {
        // Backend created the user but didn't return a session
        // (e.g. email-verification flow) — caller should redirect to Login.
        return null;
      }
      const nextUser = result.user ?? (await fetchUser());
      if (nextUser) setUser(nextUser);
      setStatus(nextUser ? "authenticated" : "unauthenticated");
      return nextUser;
    },
    [fetchUser],
  );

  const signOut = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // Drop local session even if the server call fails.
    }
    clearTokens();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await fetchUser();
    if (!me) setStatus("unauthenticated");
    return me;
  }, [fetchUser]);

  const value = useMemo<AuthApi>(
    () => ({
      status,
      user,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      signIn,
      signUp,
      signOut,
      refreshUser,
    }),
    [status, user, signIn, signUp, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthApi {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
