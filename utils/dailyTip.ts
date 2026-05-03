// Returns the tip index for today, picked from a pool of size `count`.
// Day-of-year is stable for the whole day and rotates the pool yearly,
// so the tip is the same for every user/device on a given date without
// any storage or server roundtrip.
export function tipIndexForToday(count: number): number {
  if (count <= 0) return 0;
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - startOfYear.getTime()) / 86_400_000,
  );
  return dayOfYear % count;
}
