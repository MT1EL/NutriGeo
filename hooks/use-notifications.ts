import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/api/notifications";
import type { NotificationPreferences } from "@/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * UI MODEL (camelCase)
 */
export type NotificationPreferencesUI = {
  allEnabled: boolean;
  mealReminders: boolean;
  waterReminders: boolean;
  streakKeeper: boolean;
  weeklySummary: boolean;
  motivational: boolean;
  social: boolean;
};

/**
 * API → UI
 */
function toUI(data: NotificationPreferences): NotificationPreferencesUI {
  return {
    allEnabled: data.all_enabled,
    mealReminders: data.meal_reminders,
    waterReminders: data.water_reminders,
    streakKeeper: data.streak_keeper,
    weeklySummary: data.weekly_summary,
    motivational: data.motivational,
    social: data.social,
  };
}

/**
 * UI → API
 */
function toAPI(data: NotificationPreferencesUI): NotificationPreferences {
  return {
    all_enabled: data.allEnabled,
    meal_reminders: data.mealReminders,
    water_reminders: data.waterReminders,
    streak_keeper: data.streakKeeper,
    weekly_summary: data.weeklySummary,
    motivational: data.motivational,
    social: data.social,
  };
}

const KEY = ["notificationPreferences"];

const defaultPrefs: NotificationPreferencesUI = {
  allEnabled: true,
  mealReminders: true,
  waterReminders: true,
  streakKeeper: true,
  weeklySummary: true,
  motivational: false,
  social: false,
};

/**
 * GET
 */
export function useNotificationPreferences() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const res = await getNotificationPreferences();
      return toUI(res.data);
    },
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * UPDATE (optimistic)
 */
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uiData: NotificationPreferencesUI) => {
      const res = await updateNotificationPreferences(toAPI(uiData));
      return toUI(res.data);
    },

    onMutate: async (newUI) => {
      await queryClient.cancelQueries({ queryKey: KEY });

      const previous = queryClient.getQueryData<NotificationPreferencesUI>(KEY);

      queryClient.setQueryData(KEY, newUI);

      return { previous };
    },

    onError: (_err, _new, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(KEY, ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

/**
 * 🔥 UI Hook (use THIS in screen)
 */
export function useNotifications() {
  const query = useNotificationPreferences();
  const mutation = useUpdateNotificationPreferences();

  const prefs = query.data ?? defaultPrefs;

  const update = (patch: Partial<NotificationPreferencesUI>) => {
    mutation.mutate({
      ...prefs,
      ...patch,
    });
  };

  const allOn =
    prefs.mealReminders &&
    prefs.waterReminders &&
    prefs.streakKeeper &&
    prefs.weeklySummary &&
    prefs.motivational &&
    prefs.social;

  return {
    prefs,
    allOn,
    isLoading: query.isLoading,
    isUpdating: mutation.isPending,

    update,

    setAllOn: () =>
      update({
        allEnabled: true,
        mealReminders: true,
        waterReminders: true,
        streakKeeper: true,
        weeklySummary: true,
        motivational: true,
        social: true,
      }),

    setAllOff: () =>
      update({
        allEnabled: false,
        mealReminders: false,
        waterReminders: false,
        streakKeeper: false,
        weeklySummary: false,
        motivational: false,
        social: false,
      }),
  };
}
