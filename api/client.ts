import i18n from '@/i18n';
import { API_CONFIG } from './config';
import { clearTokens, getTokens, setTokens } from './tokenStore';
import type { ApiError, ApiResponse } from './types';

type Query = Record<string, string | number | boolean | null | undefined>;

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Query;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  timezone?: string;
  idempotencyKey?: string;
  signal?: AbortSignal;
};

export class HttpError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(status: number, payload: ApiError | { message?: string } | string) {
    const message =
      typeof payload === 'string'
        ? payload
        : 'error' in payload
        ? payload.error.message
        : payload.message ?? `HTTP ${status}`;
    super(message);
    this.status = status;
    if (typeof payload === 'object' && payload !== null && 'error' in payload) {
      this.code = payload.error.code;
      this.details = payload.error.details;
    }
  }
}

function buildQueryString(query?: Query): string {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;
    params.append(key, String(value));
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }
  if (!res.ok) {
    throw new HttpError(res.status, payload as ApiError | string);
  }
  return payload as T;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  const { refreshToken } = getTokens();
  if (!refreshToken) return false;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) {
        clearTokens();
        return false;
      }
      const json = (await res.json()) as ApiResponse<{
        access_token: string;
        refresh_token: string;
      }>;
      setTokens({
        accessToken: json.data.access_token,
        refreshToken: json.data.refresh_token,
      });
      return true;
    } catch {
      clearTokens();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function doFetch<T>(path: string, options: RequestOptions, retry = true): Promise<T> {
  const {
    method = 'GET',
    query,
    body,
    headers = {},
    auth = true,
    timezone,
    idempotencyKey,
    signal,
  } = options;

  const lang = i18n.language?.split('-')[0] || 'ka';
  const finalHeaders: Record<string, string> = {
    'X-Timezone': timezone ?? API_CONFIG.defaultTimezone,
    'Accept-Language': lang,
    ...headers,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] ??= 'application/json';
  }

  if (idempotencyKey) {
    finalHeaders['Idempotency-Key'] = idempotencyKey;
  }

  if (auth) {
    const { accessToken } = getTokens();
    if (accessToken) finalHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const url = `${API_CONFIG.baseUrl}${path}${buildQueryString(query)}`;
  const init: RequestInit = {
    method,
    headers: finalHeaders,
    signal,
  };
  if (body !== undefined) {
    init.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const res = await fetch(url, init);

  if (res.status === 401 && auth && retry) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return doFetch<T>(path, options, false);
    }
  }

  return parseResponse<T>(res);
}

export const api = {
  request: doFetch,

  get<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return doFetch<T>(path, { ...options, method: 'GET' });
  },

  post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return doFetch<T>(path, { ...options, method: 'POST', body });
  },

  put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return doFetch<T>(path, { ...options, method: 'PUT', body });
  },

  patch<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return doFetch<T>(path, { ...options, method: 'PATCH', body });
  },

  delete<T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return doFetch<T>(path, { ...options, method: 'DELETE' });
  },
};
