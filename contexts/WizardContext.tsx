import type {
  ActivityLevel as ActivityLevelType,
  Diet,
  GoalType,
  Sex,
} from "@/api/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type WizardData = {
  sex: Sex | null;
  height_cm: string;
  weight_kg: string;
  age: string;
  goal_type: GoalType | null;
  activity_level: ActivityLevelType | null;
  diet: Diet;
  allergies: string[];
  restrictions: string[];
  daily_calorie_goal: string;
  protein_g: string;
  carbs_g: string;
  fat_g: string;
};

const INITIAL: WizardData = {
  sex: null,
  height_cm: "",
  weight_kg: "",
  age: "",
  goal_type: null,
  activity_level: null,
  diet: "none",
  allergies: [],
  restrictions: [],
  daily_calorie_goal: "",
  protein_g: "",
  carbs_g: "",
  fat_g: "",
};

type WizardApi = {
  data: WizardData;
  setField: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
  toggleInArray: (
    key: "allergies" | "restrictions",
    value: string,
  ) => void;
  reset: () => void;
};

const WizardContext = createContext<WizardApi | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<WizardData>(INITIAL);

  const setField = useCallback<WizardApi["setField"]>((key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleInArray = useCallback<WizardApi["toggleInArray"]>((key, value) => {
    setData((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  }, []);

  const reset = useCallback(() => setData(INITIAL), []);

  const value = useMemo(
    () => ({ data, setField, toggleInArray, reset }),
    [data, setField, toggleInArray, reset],
  );

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard(): WizardApi {
  const ctx = useContext(WizardContext);
  if (!ctx) {
    throw new Error("useWizard must be used inside <WizardProvider>");
  }
  return ctx;
}
