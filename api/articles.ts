import { api } from './client';
import type { ApiResponse, Article, Paginated } from './types';

export type ListArticlesParams = {
  page?: number;
  limit?: number;
  category?: string;
};

export function listArticles(params: ListArticlesParams = {}) {
  const { page = 1, limit = 20, ...rest } = params;
  return api.get<Paginated<Article>>('/v1/articles', {
    query: { page, limit, ...rest },
  });
}

export function getFeaturedArticles() {
  return api.get<ApiResponse<Article[]>>('/v1/articles/featured');
}

export function getBookmarkedArticles() {
  return api.get<ApiResponse<Article[]>>('/v1/bookmarks/articles');
}

export function getArticleById(id: string) {
  return api.get<ApiResponse<Article>>(`/v1/articles/${id}`);
}

export function recordArticleRead(id: string, readPct: number) {
  return api.post<ApiResponse<{ read_pct: number }>>(`/v1/articles/${id}/read`, {
    read_pct: readPct,
  });
}

export function bookmarkArticle(id: string) {
  return api.post<ApiResponse<{ ok: true }>>(`/v1/articles/${id}/bookmark`);
}

export function unbookmarkArticle(id: string) {
  return api.delete<ApiResponse<{ ok: true }>>(`/v1/articles/${id}/bookmark`);
}
