import type { MealKey as ApiMealKey } from "@/api/types";
import {
  Coffee,
  HandPlatter,
  LucideIcon,
  Salad,
  Sandwich,
} from "lucide-react-native";

export type Food = {
  id: string;
  title: string;
  calories: number;
  serving: string;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealKey = "საუზმე" | "სადილი" | "სნექი" | "ვახშამი";

export type MealConfig = {
  key: MealKey;
  Icon: LucideIcon;
  iconColor: string;
  iconTint: string;
  iconTintDark: string;
  goal?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
};

export const MEAL_KEYS: MealKey[] = ["საუზმე", "სადილი", "სნექი", "ვახშამი"];

export const MEAL_CONFIGS: Record<MealKey, MealConfig> = {
  საუზმე: {
    key: "საუზმე",
    Icon: Coffee,
    iconColor: "#E8A02C",
    iconTint: "#FEF6E4",
    iconTintDark: "#3A2E10",
  },
  სადილი: {
    key: "სადილი",
    Icon: Salad,
    iconColor: "#2FB871",
    iconTint: "#E8F6EC",
    iconTintDark: "#1F3A28",
    goal: 600,
    proteinGoal: 45,
    carbsGoal: 70,
    fatGoal: 22,
  },
  სნექი: {
    key: "სნექი",
    Icon: Sandwich,
    iconColor: "#F5A623",
    iconTint: "#FEF1E0",
    iconTintDark: "#3A2A10",
    // goal: 200,
    // proteinGoal: 12,
    // carbsGoal: 25,
    // fatGoal: 8,
  },
  ვახშამი: {
    key: "ვახშამი",
    Icon: HandPlatter,
    iconColor: "#5B6CE0",
    iconTint: "#EEF0FB",
    iconTintDark: "#222B4A",
    // goal: 700,
    // proteinGoal: 50,
    // carbsGoal: 75,
    // fatGoal: 25,
  },
};

export const MEAL_KEY_TO_API: Record<MealKey, ApiMealKey> = {
  საუზმე: "breakfast",
  სადილი: "lunch",
  სნექი: "snack",
  ვახშამი: "dinner",
};

export const MEAL_KEY_TO_I18N: Record<MealKey, string> = {
  საუზმე: "meal.breakfast",
  სადილი: "meal.lunch",
  სნექი: "meal.snack",
  ვახშამი: "meal.dinner",
};

export const isMealKey = (s: string | undefined): s is MealKey =>
  s !== undefined && (MEAL_KEYS as string[]).includes(s);
