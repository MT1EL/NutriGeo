import { api } from './client';

export function getHealth() {
  return api.get<{ status: string }>('/health', { auth: false });
}
