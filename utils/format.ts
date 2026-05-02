// Signed weight delta in kg, e.g. "+1.2კგ", "−0.5კგ", "0კგ", "—".
export function formatWeightChange(kg: number | undefined): string {
  if (kg == null) return "—";
  const sign = kg > 0 ? "+" : kg < 0 ? "−" : "";
  return `${sign}${Math.abs(kg).toFixed(1)}კგ`;
}
