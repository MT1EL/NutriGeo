import {
  getArticleCategories,
  getFeaturedArticles,
  listArticles,
} from "@/api/articles";
import type { Article, ArticleCategory } from "@/api/types";
import i18n from "@/i18n";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export function useArticlesList() {
  const [activeCat, setActiveCat] = useState<string>("all");

  const listQuery = useQuery({
    queryKey: ["articles", "list", activeCat],
    queryFn: () =>
      listArticles({
        limit: 30,
        sort: "published_at_desc",
        ...(activeCat !== "all" ? { category: activeCat } : {}),
      }),
  });
  const categoriesQuery = useQuery({
    queryKey: ["articles", "categories"],
    queryFn: getArticleCategories,
  });
  const featuredQuery = useQuery({
    queryKey: ["articles", "featured"],
    queryFn: getFeaturedArticles,
  });

  const articles: Article[] = useMemo(() => {
    const raw = listQuery.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [listQuery.data]);

  const featuredList: Article[] = useMemo(() => {
    const raw = featuredQuery.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [featuredQuery.data]);

  const categories: { slug: string; label: string }[] = useMemo(() => {
    const raw = categoriesQuery.data?.data;
    const list: ArticleCategory[] = Array.isArray(raw) ? raw : [];
    return [
      { slug: "all", label: i18n.t("articles.categoryAll") },
      ...list.map((c) => ({ slug: c.slug, label: c.label })),
    ];
  }, [categoriesQuery.data]);

  const hero: Article | undefined =
    activeCat === "all" ? (featuredList[0] ?? articles[0]) : articles[0];
  const rest = useMemo(
    () => (hero ? articles.filter((a) => a.id !== hero.id) : articles),
    [articles, hero],
  );

  return {
    activeCat,
    setActiveCat,
    articles,
    categories,
    hero,
    rest,
    isLoading: listQuery.isLoading,
  };
}
