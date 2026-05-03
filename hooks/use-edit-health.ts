import type { Diet } from "@/api";
import { HealthInput, updateHealth } from "@/api/profile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import i18n from "@/i18n";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function toggle(set: Set<string>, key: string): Set<string> {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

export function useEditHealth() {
  const toast = useToast();
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();

  const [diet, setDiet] = useState<Diet>(user?.health.diet || "none");
  const [allergies, setAllergies] = useState<Set<string>>(
    new Set(user?.health.allergies),
  );
  const [restrictions, setRestrictions] = useState<Set<string>>(
    new Set(user?.health.restrictions),
  );

  const mutation = useMutation({
    mutationFn: (input: HealthInput) => updateHealth(input),
    onSuccess: async (res) => {
      queryClient.setQueryData(["Profile"], res);
      await queryClient.invalidateQueries({ queryKey: ["Profile"] });
      await refreshUser();
      toast.success(i18n.t("profile.healthSaved"));
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : i18n.t("common.saveFailed");
      toast.error(message, i18n.t("common.error"));
    },
  });

  return {
    diet,
    setDiet,
    allergies,
    toggleAllergy: (key: string) => setAllergies((s) => toggle(s, key)),
    restrictions,
    toggleRestriction: (key: string) => setRestrictions((s) => toggle(s, key)),
    isSaving: mutation.isPending,
    save: () =>
      mutation.mutate({
        diet,
        allergies: [...allergies],
        restrictions: [...restrictions],
      }),
  };
}
