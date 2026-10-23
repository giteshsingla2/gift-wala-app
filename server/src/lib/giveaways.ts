import { and, asc, eq, gte, inArray, lte } from "drizzle-orm";

import { db, schema } from "@/db";
import { daysBetween, istDate } from "./dates";
import { absUrl } from "./http";

type Giveaway = typeof schema.giveaways.$inferSelect;
type DayRow = typeof schema.giveawayDays.$inferSelect;
type Progress = typeof schema.progress.$inferSelect;

/** Giveaways the app shows today: live, and today is within start..last date (India time). */
export async function liveGiveaways(today = istDate(), categoryId?: number) {
  const where = [eq(schema.giveaways.status, "live"), lte(schema.giveaways.startDate, today), gte(schema.giveaways.lastDate, today)];
  if (categoryId) where.push(eq(schema.giveaways.categoryId, categoryId));
  return db
    .select()
    .from(schema.giveaways)
    .where(and(...where))
    .orderBy(asc(schema.giveaways.sortOrder), asc(schema.giveaways.id));
}

export async function progressFor(userId: number, giveawayIds: number[]) {
  const map = new Map<number, Progress>();
  if (giveawayIds.length === 0) return map;
  const rows = await db
    .select()
    .from(schema.progress)
    .where(and(eq(schema.progress.userId, userId), inArray(schema.progress.giveawayId, giveawayIds)));
  for (const r of rows) map.set(r.giveawayId, r);
  return map;
}

export async function dayPlans(giveawayIds: number[]) {
  const map = new Map<number, DayRow[]>();
  if (giveawayIds.length === 0) return map;
  const rows = await db
    .select()
    .from(schema.giveawayDays)
    .where(inArray(schema.giveawayDays.giveawayId, giveawayIds))
    .orderBy(asc(schema.giveawayDays.dayNumber));
  for (const r of rows) map.set(r.giveawayId, [...(map.get(r.giveawayId) ?? []), r]);
  return map;
}

/** The task for a day number: that day's row, else the closest earlier day, else day 1. */
export function taskForDay(plan: DayRow[] | undefined, day: number): DayRow | undefined {
  if (!plan?.length) return undefined;
  return plan.find((d) => d.dayNumber === day) ?? [...plan].reverse().find((d) => d.dayNumber < day) ?? plan[0];
}

export type UserState = {
  daysCompleted: number;
  doneToday: boolean;
  finished: boolean;
  /** Day number the user would do today (or just did). */
  currentDay: number;
  /** False when there aren't enough days left before the last date to finish. */
  canFinish: boolean;
  daysLeft: number;
};

export function userState(g: Giveaway, p: Progress | undefined, today = istDate()): UserState {
  const daysCompleted = p?.daysCompleted ?? 0;
  const doneToday = p?.lastDoneOn === today;
  const finished = daysCompleted >= g.haazriDays;
  const daysLeft = Math.max(0, daysBetween(today, g.lastDate) + (doneToday ? 0 : 1));
  const needed = g.haazriDays - daysCompleted;
  return {
    daysCompleted,
    doneToday,
    finished,
    currentDay: doneToday || finished ? Math.max(1, daysCompleted) : daysCompleted + 1,
    canFinish: finished || needed <= daysLeft,
    daysLeft,
  };
}

export function serializeTask(t: DayRow | undefined) {
  if (!t) return null;
  return {
    day: t.dayNumber,
    type: t.taskType,
    url: t.taskType === "website" ? t.websiteUrl : null,
    minSeconds: t.taskType === "website" ? t.minSeconds : null,
    shareCount: t.taskType === "share" ? t.shareCount : null,
    shareMessage: t.taskType === "share" ? t.shareMessage : null,
  };
}

export function serializeGiveaway(request: Request, g: Giveaway, state?: UserState, task?: DayRow) {
  return {
    id: String(g.id),
    title: g.title,
    subtitle: g.subtitle,
    imageUrl: absUrl(request, g.imageUrl),
    tileColorFrom: g.tileColorFrom,
    tileColorTo: g.tileColorTo,
    categoryId: g.categoryId ? String(g.categoryId) : null,
    tag: g.tagText,
    tagStyle: g.tagStyle,
    winnersCount: g.winnersCount,
    prizeValue: g.prizeValue,
    haazriDays: g.haazriDays,
    startDate: g.startDate,
    lastDate: g.lastDate,
    resultAt: g.resultAt?.toISOString() ?? null,
    featured: g.isFeatured,
    rulesText: g.rulesText ?? "",
    progress: state ?? null,
    todayTask: task ? serializeTask(task) : undefined,
  };
}
