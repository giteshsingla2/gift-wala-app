import { asc, eq } from "drizzle-orm";

import { db, schema } from "@/db";
import type { GiveawayFormValues } from "@/components/admin/giveaway-form";
import { addDays, istDate } from "./dates";
import { dateToIstLocal } from "./form";

export async function allCategories() {
  return db.select().from(schema.categories).orderBy(asc(schema.categories.sortOrder), asc(schema.categories.id));
}

export async function giveawayFormValues(id: number): Promise<GiveawayFormValues | null> {
  const [g] = await db.select().from(schema.giveaways).where(eq(schema.giveaways.id, id));
  if (!g) return null;
  const days = await db.select().from(schema.giveawayDays).where(eq(schema.giveawayDays.giveawayId, id)).orderBy(asc(schema.giveawayDays.dayNumber));
  return {
    id: g.id,
    title: g.title,
    subtitle: g.subtitle,
    imageUrl: g.imageUrl,
    tileColorFrom: g.tileColorFrom,
    tileColorTo: g.tileColorTo,
    categoryId: g.categoryId,
    tagText: g.tagText,
    tagStyle: g.tagStyle,
    winnersCount: g.winnersCount,
    prizeValue: g.prizeValue,
    haazriDays: g.haazriDays,
    startDate: g.startDate,
    lastDate: g.lastDate,
    resultAt: dateToIstLocal(g.resultAt),
    isFeatured: g.isFeatured,
    sortOrder: g.sortOrder,
    status: g.status,
    rulesText: g.rulesText ?? "",
    days: days.map((d) => ({
      taskType: d.taskType,
      websiteUrl: d.websiteUrl ?? "",
      minSeconds: d.minSeconds,
      shareCount: d.shareCount,
      shareMessage: d.shareMessage ?? "",
    })),
  };
}

export function newGiveawayValues(): GiveawayFormValues {
  const today = istDate();
  return {
    title: "",
    subtitle: "",
    imageUrl: null,
    tileColorFrom: "#FFE7A3",
    tileColorTo: "#FFB938",
    categoryId: null,
    tagText: "DAILY",
    tagStyle: "daily",
    winnersCount: 1,
    prizeValue: 0,
    haazriDays: 1,
    startDate: today,
    lastDate: addDays(today, 6),
    resultAt: `${addDays(today, 7)}T10:00`,
    isFeatured: false,
    sortOrder: 0,
    status: "draft",
    rulesText: "One haazri per day. Entry is free: we never ask for money. Winners are picked by a random draw.",
    days: [{ taskType: "share", websiteUrl: "", minSeconds: 30, shareCount: 5, shareMessage: "" }],
  };
}

export function formatIstDate(day: string) {
  const d = new Date(`${day}T00:00:00Z`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatIstDateTime(d: Date | null | undefined) {
  if (!d) return "—";
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
}
