import { getFeaturedRecipes, listRecipes } from "@/api/recipes";
import type { Recipe } from "@/api/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const SEARCH_DEBOUNCE_MS = 300;

export function useRecipesList() {
  const [active, setActive] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(
      () => setDebouncedQuery(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(id);
  }, [searchInput]);

  const listQuery = useQuery({
    queryKey: ["recipes", "list", active, debouncedQuery],
    queryFn: () =>
      listRecipes({
        limit: 30,
        ...(active !== "all" ? { category: active } : {}),
        ...(debouncedQuery ? { q: debouncedQuery } : {}),
      }),
    placeholderData: keepPreviousData,
  });
  const featuredQuery = useQuery({
    queryKey: ["recipes", "featured"],
    queryFn: getFeaturedRecipes,
    enabled: !debouncedQuery,
    placeholderData: keepPreviousData,
  });

  const rawRecipes: Recipe[] = useMemo(() => {
    const raw = listQuery.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [listQuery.data]);

  // Client-side fallback filter so search works even if backend ignores ?q=.
  const recipes: Recipe[] = useMemo(() => {
    if (!debouncedQuery) return rawRecipes;
    const needle = debouncedQuery.toLowerCase();
    return rawRecipes.filter(
      (r) =>
        r.title.toLowerCase().includes(needle) ||
        (r.description?.toLowerCase().includes(needle) ?? false),
    );
  }, [rawRecipes, debouncedQuery]);

  const featuredList: Recipe[] = useMemo(() => {
    const raw = featuredQuery.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [featuredQuery.data]);

  const hero: Recipe | undefined = debouncedQuery
    ? undefined
    : active === "all"
      ? (featuredList[0] ?? recipes[0])
      : recipes[0];
  const rest = useMemo(
    () => (hero ? recipes.filter((r) => r.id !== hero.id) : recipes),
    [recipes, hero],
  );

  const quickCount = useMemo(
    () => recipes.filter((r) => r.duration_min <= 30).length,
    [recipes],
  );

  return {
    active,
    setActive,
    searchInput,
    setSearchInput,
    debouncedQuery,
    recipes,
    hero,
    rest,
    quickCount,
    isLoading: listQuery.isLoading,
    refetch: listQuery.refetch,
  };
}
