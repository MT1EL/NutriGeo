import { deleteMe } from "@/api/me";
import {
  getProfile,
  requestExport,
  updateSettings,
  type SettingsInput,
} from "@/api/profile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const profile = profileQuery.data?.data;
  const units = (profile?.units as Units) ?? "metric";
  const themeMode = (profile?.theme as ThemeMode) ?? "system";

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
      return { previous };
    },
    onError: (err, _input, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(PROFILE_QUERY_KEY, ctx.previous);
      }
      const message =
        err instanceof Error ? err.message : "შენახვა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
    onSuccess: async (res) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, res);
      await refreshUser();
    },
  });

  const exportMutation = useMutation({
    mutationFn: () => requestExport("csv"),
    onSuccess: () => {
      toast.success("ექსპორტი დაიწყო", "ელფოსტა მიიღებ რამდენიმე წუთში");
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "ექსპორტი ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => deleteMe(),
    onSuccess: async () => {
      toast.success("ანგარიში წაშლილია");
      await signOut();
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "წაშლა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  return {
    units,
    themeMode,
    isSavingSettings: settingsMutation.isPending,
    isExporting: exportMutation.isPending,
    setUnits: (next: Units) =>
      next !== units && settingsMutation.mutate({ units: next }),
    setThemeMode: (next: ThemeMode) =>
      next !== themeMode && settingsMutation.mutate({ theme: next }),
    requestExport: () => exportMutation.mutate(),
    deleteAccount: () => deleteAccountMutation.mutate(),
  };
}
