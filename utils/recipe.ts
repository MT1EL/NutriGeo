import type { Recipe } from "@/api/types";

export function difficultyLabelKey(d: Recipe["difficulty"]): string | null {
  if (!d) return null;
  return `recipes.${d}`;
}
