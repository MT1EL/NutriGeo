import { logWeight } from "@/api/weight";
import type { Units } from "@/api/types";
import { useActiveDate } from "@/contexts/ActiveDateContext";
import { useToast } from "@/contexts/ToastContext";
import i18n from "@/i18n";
import { track } from "@/lib/analytics";
import { loggedAtForDate } from "@/utils/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type LogWeightArgs = {
  weight: number;
  units?: Units;
};

export function useLogWeight() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { date } = useActiveDate();

  return useMutation({
    mutationFn: ({ weight, units }: LogWeightArgs) =>
      logWeight({
        weight,
        units,
        source: "manual",
        logged_at: loggedAtForDate(date),
      }),
    onSuccess: () => {
      // Stats overview embeds the weight series; profile holds the user's
      // weight which the backend updates on log; ["home", "day"] carries
      // each day's snapshot; ["weight"] is the stats history query.
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["Profile"] });
      queryClient.invalidateQueries({ queryKey: ["home", "day"] });
      queryClient.invalidateQueries({ queryKey: ["weight"] });
      track("weight_logged", { source: "manual" });
      toast.success(i18n.t("weight.saved"));
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : i18n.t("common.saveFailed");
      toast.error(message, i18n.t("common.error"));
    },
  });
}
