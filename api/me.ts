import { api } from './client';
import { clearTokens } from './tokenStore';
import type { ApiResponse, User } from './types';

export function getMe() {
  return api.get<ApiResponse<User>>('/v1/me');
}

export function updatePassword(currentPassword: string, newPassword: string) {
  return api.put<ApiResponse<{ ok: true }>>('/v1/me/password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
}

export async function deleteMe() {
  const res = await api.delete<ApiResponse<{ ok: true }>>('/v1/me');
  clearTokens();
  return res;
}
