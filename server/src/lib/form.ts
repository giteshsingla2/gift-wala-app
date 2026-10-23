// Helpers for reading FormData in server actions.

export type ActionState = { error?: string; success?: string };

export function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function int(fd: FormData, key: string, fallback = 0) {
  const n = Number.parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : fallback;
}

export function bool(fd: FormData, key: string) {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

export function file(fd: FormData, key: string) {
  const v = fd.get(key);
  return v instanceof File && v.size > 0 ? v : null;
}

/** "YYYY-MM-DDTHH:mm" typed as India time → UTC Date. */
export function istLocalToDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  return new Date(`${value}:00+05:30`);
}

/** UTC Date → "YYYY-MM-DDTHH:mm" in India time, for datetime-local inputs. */
export function dateToIstLocal(d: Date | null | undefined): string {
  if (!d) return "";
  return new Date(d.getTime() + 330 * 60_000).toISOString().slice(0, 16);
}

export function errorMessage(e: unknown) {
  return e instanceof Error ? e.message : "Something went wrong.";
}
