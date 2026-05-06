// `months` and `weekdays` arrays come from the calling component's
// `t("dates.months"/"dates.weekdaysShort", { returnObjects: true })`. Don't
// read i18n inside these functions — the React Compiler would memoize the
// result by `Date` alone and miss language changes.

export function formatTodayKa(d: Date, months: readonly string[]): string {
  const month = months[d.getMonth()] ?? "";
  return `${d.getDate()} ${month}, ${d.getFullYear()}`;
}

// Local-timezone "today" as YYYY-MM-DD — matches backend's notion of today
// (which honors X-Timezone → users.timezone). Avoid `.toISOString()` here:
// that's UTC and silently rolls back a day for users east of UTC during the
// late-night hours.
export function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function weekdayShort(
  dateStr: string | undefined,
  weekdays: readonly string[],
): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return weekdays[d.getDay()] ?? "";
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

// Build a `logged_at` timestamp that lands on the given local date (used when
// logging food to a past day). Noon-local converts cleanly to UTC and falls
// safely inside the right calendar day for any timezone.
export function loggedAtForDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0).toISOString();
}

// ISO date for "today minus N years" — fabricates a birth date when only an
// age is known. Approximate: assumes today's month/day, used as backend payload.
export function birthDateFromAge(ageStr: string): string {
  const age = Number(ageStr);
  const today = new Date();
  const yyyy = today.getFullYear() - age;
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
