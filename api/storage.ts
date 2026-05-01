import { api } from './client';
import type { ApiResponse } from './types';

export type StorageBucket = 'avatars' | 'foods' | 'recipes' | 'misc';

export type UploadUrl = {
  upload_url: string;
  public_url?: string;
  method: 'PUT' | 'POST';
  headers?: Record<string, string>;
  expires_at: string;
};

export function getUploadUrl(bucket: StorageBucket, path: string) {
  return api.post<ApiResponse<UploadUrl>>('/v1/storage/upload-url', {
    bucket,
    path,
  });
}
