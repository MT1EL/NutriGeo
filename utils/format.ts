// Weight delta as a signed string with the localized "kg" suffix appended.
// `kgLabel` must be passed in (typically `t("weight.kg")`) — reading i18n from
// inside this function would make it look pure to the React Compiler, which
// would memoize the result by `kg` alone and miss language changes.
export function formatWeightChange(
  kg: number | undefined,
  kgLabel: string,
): string {
  if (kg == null) return "—";
  const sign = kg > 0 ? "+" : kg < 0 ? "−" : "";
  return `${sign}${Math.abs(kg).toFixed(1)}${kgLabel}`;
}
