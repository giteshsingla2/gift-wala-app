// India calendar helpers. "Today" is always decided here on the server, never by the phone.

const IST = "Asia/Kolkata";
const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: IST, year: "numeric", month: "2-digit", day: "2-digit" });

/** India date for a moment, as "YYYY-MM-DD". */
export function istDate(d: Date = new Date()): string {
  return ymd.format(d);
}

/** Whole days from date a to date b ("YYYY-MM-DD"); positive when b is later. */
export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

export function addDays(day: string, n: number): string {
  const t = new Date(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000);
  return t.toISOString().slice(0, 10);
}

/** UTC moment for 00:00 India time on the given India date. */
export function istMidnightUtc(day: string): Date {
  return new Date(Date.parse(`${day}T00:00:00+05:30`));
}
