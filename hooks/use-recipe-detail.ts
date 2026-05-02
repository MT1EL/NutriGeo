import { getRecipeById, saveRecipe, unsaveRecipe } from "@/api/recipes";
import { useToast } from "@/contexts/ToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useRecipeDetail(id: string | undefined) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const recipeQuery = useQuery({
    queryKey: ["recipes", "detail", id],
    queryFn: () => getRecipeById(id!),
    enabled: !!id,
  });

  const recipe = recipeQuery.data?.data;
  const related = recipe?.related ?? [];

  // Trust recipe.saved from the detail response. Optimistic override wins
  // while the toggle mutation is in flight.
  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const saved = savedOverride !== null ? savedOverride : !!recipe?.saved;

  const saveMutation = useMutation({
    mutationFn: ({ next }: { next: boolean }) =>
      next ? saveRecipe(id!) : unsaveRecipe(id!),
    onMutate: ({ next }) => {
      setSavedOverride(next);
    },
    onError: (err, { next }) => {
      setSavedOverride(!next);
      const message =
        err instanceof Error ? err.message : "შენახვა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["recipes", "saved"] });
    },
  });

  return {
    recipe,
    related,
    saved,
    isLoading: recipeQuery.isLoading,
    toggleSaved: () => saveMutation.mutate({ next: !saved }),
    isToggling: saveMutation.isPending,
  };
}
