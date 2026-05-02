import type { Recipe } from "@/api/types";

const DIFFICULTY_LABELS: Record<NonNullable<Recipe["difficulty"]>, string> = {
  easy: "მარტივი",
  medium: "საშუალო",
  hard: "რთული",
};

export function difficultyLabel(d: Recipe["difficulty"]): string {
  if (!d) return "—";
  return DIFFICULTY_LABELS[d];
}
