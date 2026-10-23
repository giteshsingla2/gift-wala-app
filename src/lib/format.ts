import { t } from '@/i18n';

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** "19:30" or a Date → "7:30 PM". */
export function formatTime(value: string | Date) {
  const [h, m] = typeof value === 'string' ? value.split(':').map(Number) : [value.getHours(), value.getMinutes()];
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? t.dates.am : t.dates.pm}`;
}

/** India calendar date "YYYY-MM-DD" → "8 Nov". */
export function formatDay(day: string) {
  const [, m, d] = day.split('-').map(Number);
  return `${d} ${t.dates.months[m - 1]}`;
}

/** ISO moment → "8 Nov, 10:00 AM". */
export function formatMoment(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${t.dates.months[d.getMonth()]}, ${formatTime(d)}`;
}

/** "Yesterday", "Today", or "8 Nov". */
export function formatWonAt(iso: string, now = new Date()) {
  const d = new Date(iso);
  const days = Math.round((startOfDay(now) - startOfDay(d)) / DAY_MS);
  if (days === 0) return t.dates.today;
  if (days === 1) return t.dates.yesterday;
  return `${d.getDate()} ${t.dates.months[d.getMonth()]}`;
}

export function minutesSince(iso: string, now = new Date()) {
  return Math.max(1, Math.round((now.getTime() - new Date(iso).getTime()) / 60000));
}

export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export const pad2 = (n: number) => n.toString().padStart(2, '0');

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ''}${parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''}`.toUpperCase();
}

/** The moment a countdown on a giveaway should run to: its result time, else the end of its last date. */
export function countdownTarget(g: { resultAt: string | null; lastDate: string }) {
  return g.resultAt ?? `${g.lastDate}T23:59:59+05:30`;
}
