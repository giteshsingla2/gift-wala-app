import { t } from '@/i18n';

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function formatTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${h < 12 ? t.dates.am : t.dates.pm}`;
}

export function formatShortDate(d: Date) {
  return `${d.getDate()} ${t.dates.months[d.getMonth()]}`;
}

// "11:59 PM" today, "Sunday" this week, "8 Nov" further out.
export function formatEnds(iso: string, now = new Date()) {
  const d = new Date(iso);
  const days = Math.round((startOfDay(d) - startOfDay(now)) / DAY_MS);
  if (days <= 0) return formatTime(d);
  if (days < 7) return t.dates.weekdays[d.getDay()];
  return formatShortDate(d);
}

// "Yesterday", "Today", or "8 Nov".
export function formatWonAt(iso: string, now = new Date()) {
  const d = new Date(iso);
  const days = Math.round((startOfDay(now) - startOfDay(d)) / DAY_MS);
  if (days === 0) return t.dates.today;
  if (days === 1) return t.dates.yesterday;
  return formatShortDate(d);
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

export function initials(first: string, last?: string) {
  return `${first[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
}

export function fullName(first: string, last?: string) {
  return last ? `${first} ${last}` : first;
}
