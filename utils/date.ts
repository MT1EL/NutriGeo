const KA_MONTHS = [
  "იანვარი",
  "თებერვალი",
  "მარტი",
  "აპრილი",
  "მაისი",
  "ივნისი",
  "ივლისი",
  "აგვისტო",
  "სექტემბერი",
  "ოქტომბერი",
  "ნოემბერი",
  "დეკემბერი",
];

export function formatTodayKa(d: Date = new Date()): string {
  return `${d.getDate()} ${KA_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

const WEEK_LABELS_KA = ["კვ", "ორ", "სა", "ოთ", "ხუ", "პა", "შა"];

// Short Georgian weekday label for a YYYY-MM-DD style date string.
export function weekdayShort(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return WEEK_LABELS_KA[d.getDay()] ?? "";
}

// Whole-years age from an ISO birth date. Returns null for missing/invalid.
export function ageFromBirthDate(
  birthDate: string | null | undefined,
): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    years -= 1;
  }
  return years;
}

// ISO date for "today minus N years" — fabricates a birth date when only an
// age is known. Approximate: assumes today's month/day, used as backend payload.
export function birthDateFromAge(ageStr: string): string {
  const age = Number(ageStr);
  const today = new Date();
  const birth = new Date(
    today.getFullYear() - age,
    today.getMonth(),
    today.getDate(),
  );
  return birth.toISOString().slice(0, 10);
}
