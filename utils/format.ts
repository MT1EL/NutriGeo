import i18n from "@/i18n";

export function formatWeightChange(kg: number | undefined): string {
  if (kg == null) return "—";
  const sign = kg > 0 ? "+" : kg < 0 ? "−" : "";
  return `${sign}${Math.abs(kg).toFixed(1)}${i18n.t("weight.kg")}`;
}
