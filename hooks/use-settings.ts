import { deleteMe } from "@/api/me";
import {
  getProfile,
  requestExport,
  updateSettings,
  type SettingsInput,
} from "@/api/profile";
import type { Language } from "@/api/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import i18n from "@/i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const PROFILE_QUERY_KEY = ["Profile"] as const;

export type Units = "metric" | "imperial";
export type ThemeMode = "system" | "light" | "dark";

export function useSettings() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { signOut, refreshUser } = useAuth();

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
  });
  const profile = profileQuery.data?.data?.profile;
  const [units, setUnits] = useState<Units>(profile?.units || "metric");
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    profile?.theme || "system",
  );
  const [language, setLanguage] = useState<Language>(profile?.language || "ka");

  const settingsMutation = useMutation({
    mutationFn: (input: Partial<SettingsInput>) => {
      const payload: SettingsInput = {
        units: input.units ?? (profile?.units as Units) ?? "metric",
        theme: input.theme ?? (profile?.theme as ThemeMode) ?? "system",
        language: input.language ?? profile?.language ?? "ka",
        timezone: input.timezone ?? profile?.timezone ?? "Asia/Tbilisi",
      };
      return updateSettings(payload);
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: PROFILE_QUERY_KEY });
      const previous = queryClient.getQueryData(PROFILE_QUERY_KEY);
      queryClient.setQueryData(
        PROFILE_QUERY_KEY,
        (old: typeof profileQuery.data) => {
          if (!old) return old;
          return { ...old, data: { ...old.data, ...input } };
        },
      );
      if (input.theme) {
        setThemeMode(input.theme);
      } else if (input.language) {
        setLanguage(input.language);
      } else if (input.units) {
        setUnits(input.units);
      }
      return { previous };
    },
    onError: (err, _input, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(PROFILE_QUERY_KEY, ctx.previous);
      }
      const message =
        err instanceof Error ? err.message : i18n.t("common.saveFailed");
      toast.error(message, i18n.t("common.error"));
    },
    onSuccess: async (res) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, res);
      await refreshUser();
    },
  });

  const exportMutation = useMutation({
    mutationFn: () => requestExport("csv"),
    onSuccess: () => {
      toast.success(
        i18n.t("settings.exportStarted"),
        i18n.t("settings.exportEmailHint"),
      );
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : i18n.t("settings.exportFailed");
      toast.error(message, i18n.t("common.error"));
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => deleteMe(),
    onSuccess: async () => {
      toast.success(i18n.t("settings.accountDeleted"));
      await signOut();
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : i18n.t("settings.deleteFailed");
      toast.error(message, i18n.t("common.error"));
    },
  });

  return {
    units,
    themeMode,
    language,
    isSavingSettings: settingsMutation.isPending,
    isExporting: exportMutation.isPending,
    setUnits: (next: Units) =>
      next !== units && settingsMutation.mutate({ units: next }),
    setThemeMode: (next: ThemeMode) =>
      next !== themeMode && settingsMutation.mutate({ theme: next }),
    setLanguage: (next: Language) =>
      next !== language && settingsMutation.mutate({ language: next }),
    requestExport: () => exportMutation.mutate(),
    deleteAccount: () => deleteAccountMutation.mutate(),
  };
}
