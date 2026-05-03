import {
  bookmarkArticle,
  getArticleById,
  getRelatedArticles,
  recordArticleRead,
  unbookmarkArticle,
} from "@/api/articles";
import type { Article } from "@/api/types";
import { useToast } from "@/contexts/ToastContext";
import i18n from "@/i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

const PROGRESS_REPORT_STEP = 25;

export function useArticleDetail(id: string | undefined) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const articleQuery = useQuery({
    queryKey: ["articles", "detail", id],
    queryFn: () => getArticleById(id!),
    enabled: !!id,
  });
  const relatedQuery = useQuery({
    queryKey: ["articles", "related", id],
    queryFn: () => getRelatedArticles(id!, 3),
    enabled: !!id,
  });

  const article = articleQuery.data?.data;
  const related: Article[] = useMemo(() => {
    const raw = relatedQuery.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [relatedQuery.data]);

  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const saved = savedOverride !== null ? savedOverride : !!article?.bookmarked;

  const bookmarkMutation = useMutation({
    mutationFn: ({ next }: { next: boolean }) =>
      next ? bookmarkArticle(id!) : unbookmarkArticle(id!),
    onMutate: ({ next }) => {
      setSavedOverride(next);
    },
    onError: (err, { next }) => {
      setSavedOverride(!next);
      const message =
        err instanceof Error ? err.message : i18n.t("common.saveFailed");
      toast.error(message, i18n.t("common.error"));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["articles", "bookmarked"] });
    },
  });

  const readMutation = useMutation({
    mutationFn: (pct: number) => recordArticleRead(id!, pct),
  });

  // Reports read progress in 25-pct increments to avoid spamming the backend.
  const reportedPctRef = useRef(0);
  useEffect(() => {
    reportedPctRef.current = article?.read_pct ?? 0;
  }, [id, article?.read_pct]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!id) return;
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const total = contentSize.height - layoutMeasurement.height;
    if (total <= 0) return;
    const pct = Math.min(
      100,
      Math.max(0, Math.round(((contentOffset.y || 0) / total) * 100)),
    );
    if (pct >= reportedPctRef.current + PROGRESS_REPORT_STEP) {
      reportedPctRef.current = pct;
      readMutation.mutate(pct);
    }
  };

  return {
    article,
    related,
    isLoading: articleQuery.isLoading,
    isError: articleQuery.isError,
    refetch: () => {
      void articleQuery.refetch();
    },
    saved,
    isToggling: bookmarkMutation.isPending,
    toggleBookmark: () => bookmarkMutation.mutate({ next: !saved }),
    handleScroll,
  };
}
