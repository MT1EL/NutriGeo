import { api } from './client';
import type {
  ApiResponse,
  Article,
  ArticleCategory,
  Paginated,
} from './types';

export type ArticleSort =
  | 'published_at_desc'
  | 'read_min_asc'
  | 'popular';

export type ListArticlesParams = {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
  sort?: ArticleSort;
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

export function getArticleCategories() {
  return api.get<ApiResponse<ArticleCategory[]>>('/v1/articles/categories');
}

export function getArticleById(id: string) {
  return api.get<ApiResponse<Article>>(`/v1/articles/${id}`);
}

export function getRelatedArticles(id: string, limit = 3) {
  return api.get<ApiResponse<Article[]>>(`/v1/articles/${id}/related`, {
    query: { limit },
  });
}

export type RecordReadResponse = {
  read_pct: number;
  read_at?: string | null;
};

export function recordArticleRead(id: string, readPct: number) {
  return api.post<ApiResponse<RecordReadResponse>>(
    `/v1/articles/${id}/read`,
    { read_pct: readPct },
  );
}

export function bookmarkArticle(id: string) {
  return api.post<ApiResponse<{ ok: true }>>(`/v1/articles/${id}/bookmark`);
}

export function unbookmarkArticle(id: string) {
  return api.delete<ApiResponse<{ ok: true }>>(`/v1/articles/${id}/bookmark`);
}
