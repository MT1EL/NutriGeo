import { api } from './client';
import { clearTokens, setTokens } from './tokenStore';
import type { ApiResponse, Session, User } from './types';

export type RegisterInput = {
  email: string;
  password: string;
  name?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export async function register(input: RegisterInput) {
  const res = await api.post<ApiResponse<{ user: User; session?: Session }>>(
    '/v1/auth/register',
    input,
    { auth: false },
  );
  if (res.data.session) {
    setTokens({
      accessToken: res.data.session.access_token,
      refreshToken: res.data.session.refresh_token,
    });
  }
  return res.data;
}

export async function login(input: LoginInput) {
  const res = await api.post<ApiResponse<Session>>('/v1/auth/login', input, {
    auth: false,
  });
  setTokens({
    accessToken: res.data.access_token,
    refreshToken: res.data.refresh_token,
  });
  return res.data;
}

// Note: there is no public `refresh()` here. Token refresh is handled
// transparently by the API client on 401 responses (see api/client.ts),
// guarded by a single-flight promise. Calling refresh from elsewhere risks
// rotating the refresh token concurrently with a retry.

export async function logout() {
  try {
    await api.post<ApiResponse<{ ok: true }>>('/v1/auth/logout');
  } finally {
    clearTokens();
  }
}

export function forgotPassword(email: string) {
  return api.post<ApiResponse<{ ok: true }>>(
    '/v1/auth/forgot-password',
    { email },
    { auth: false },
  );
}

export function resetPassword(newPassword: string) {
  return api.post<ApiResponse<{ ok: true }>>('/v1/auth/reset-password', {
    new_password: newPassword,
  });
}

export function verifyEmail(token: string) {
  return api.post<ApiResponse<{ ok: true }>>(
    '/v1/auth/verify-email',
    { token },
    { auth: false },
  );
}
