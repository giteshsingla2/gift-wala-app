"use server";

import { randomInt } from "node:crypto";

import { and, eq, gte, inArray, ne, notInArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db, schema } from "@/db";
import { GIVEAWAY_STATUSES, TAG_STYLES, TASK_TYPES } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { daysBetween } from "@/lib/dates";
import { bool, errorMessage, file, int, istLocalToDate, str, type ActionState } from "@/lib/form";
import { saveImage } from "@/lib/uploads";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Colours must look like #FFB938");
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date");

const DayTask = z.object({
  taskType: z.enum(TASK_TYPES),
  websiteUrl: z.string().trim().optional().default(""),
  minSeconds: z.coerce.number().int().min(5).max(3600).default(30),
  shareCount: z.coerce.number().int().min(1).max(50).default(5),
  shareMessage: z.string().trim().max(500).optional().default(""),
});

const GiveawayInput = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(120),
    subtitle: z.string().trim().max(200),
    tileColorFrom: hex,
    tileColorTo: hex,
    categoryId: z.number().int().positive().nullable(),
    tagText: z.string().trim().min(1, "Tag is required").max(30),
    tagStyle: z.enum(TAG_STYLES),
    winnersCount: z.number().int().min(1, "At least 1 winner"),
    prizeValue: z.number().int().min(0),
    haazriDays: z.number().int().min(1, "At least 1 haazri day").max(60),
    startDate: day,
    lastDate: day,
    resultAt: z.date().nullable(),
    isFeatured: z.boolean(),
    sortOrder: z.number().int(),
    status: z.enum(GIVEAWAY_STATUSES),
    rulesText: z.string().trim().max(5000),
    days: z.array(DayTask),
  })
  .superRefine((g, ctx) => {
    const span = daysBetween(g.startDate, g.lastDate) + 1;
    if (span < 1) ctx.addIssue({ code: "custom", message: "Last date must be on or after the start date." });
    else if (g.haazriDays > span) {
      ctx.addIssue({ code: "custom", message: `Only ${span} day(s) between start and last date, but ${g.haazriDays} haazri days are needed.` });
    }
    if (g.days.length !== g.haazriDays) ctx.addIssue({ code: "custom", message: "Set a task for every haazri day." });
    g.days.forEach((d, i) => {
      if (d.taskType === "website" && !/^https?:\/\/\S+$/.test(d.websiteUrl)) {
        ctx.addIssue({ code: "custom", message: `Day ${i + 1}: enter the website link (starting with https://).` });
      }
    });
  });

function parseGiveaway(fd: FormData) {
  let days: unknown = [];
  try {
    days = JSON.parse(str(fd, "days") || "[]");
  } catch {}
  return GiveawayInput.safeParse({
    title: str(fd, "title"),
    subtitle: str(fd, "subtitle"),
    tileColorFrom: str(fd, "tileColorFrom"),
    tileColorTo: str(fd, "tileColorTo"),
    categoryId: int(fd, "categoryId") || null,
    tagText: str(fd, "tagText"),
    tagStyle: str(fd, "tagStyle"),
    winnersCount: int(fd, "winnersCount", 1),
    prizeValue: int(fd, "prizeValue"),
    haazriDays: int(fd, "haazriDays", 1),
    startDate: str(fd, "startDate"),
    lastDate: str(fd, "lastDate"),
    resultAt: istLocalToDate(str(fd, "resultAt")),
    isFeatured: bool(fd, "isFeatured"),
    sortOrder: int(fd, "sortOrder"),
    status: str(fd, "status"),
    rulesText: str(fd, "rulesText"),
    days,
  });
}

export async function saveGiveaway(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = int(fd, "id");
  const parsed = parseGiveaway(fd);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  const { days, ...g } = parsed.data;

  let newId = id;
  try {
    const uploaded = await saveImage(file(fd, "image"), "prize");
    const imageUrl = uploaded ?? (bool(fd, "removeImage") ? null : undefined);
    if (!id && !uploaded) return { error: "Upload a prize photo." };

    await db.transaction(async (tx) => {
      const values = { ...g, ...(imageUrl !== undefined ? { imageUrl } : {}) };
      if (id) {
        await tx.update(schema.giveaways).set(values).where(eq(schema.giveaways.id, id));
      } else {
        const [res] = await tx.insert(schema.giveaways).values(values);
        newId = res.insertId;
      }
      // Only one giveaway holds the Home "Mega Draw" poster.
      if (g.isFeatured) await tx.update(schema.giveaways).set({ isFeatured: false }).where(ne(schema.giveaways.id, newId));
      await tx.delete(schema.giveawayDays).where(eq(schema.giveawayDays.giveawayId, newId));
      await tx.insert(schema.giveawayDays).values(
        days.map((d, i) => ({
          giveawayId: newId,
          dayNumber: i + 1,
          taskType: d.taskType,
          websiteUrl: d.taskType === "website" ? d.websiteUrl : null,
          minSeconds: d.minSeconds,
          shareCount: d.shareCount,
          shareMessage: d.taskType === "share" ? d.shareMessage || null : null,
        })),
      );
    });
  } catch (e) {
    return { error: errorMessage(e) };
  }
  revalidatePath("/admin/giveaways");
  if (!id) redirect(`/admin/giveaways/${newId}?saved=1`);
  return { success: "Saved." };
}

export async function deleteGiveaway(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id");
  const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(schema.winners).where(eq(schema.winners.giveawayId, id));
  if (Number(n) > 0) redirect(`/admin/giveaways/${id}?error=has-winners`);
  await db.delete(schema.draws).where(eq(schema.draws.giveawayId, id));
  await db.delete(schema.giveaways).where(eq(schema.giveaways.id, id));
  revalidatePath("/admin/giveaways");
  redirect("/admin/giveaways");
}

/**
 * Randomly picks winners from users who completed every haazri day, skipping blocked users and
 * people already picked for this giveaway. Picks start unpublished so the admin can review them.
 */
export async function pickWinners(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id");
  const count = int(fd, "count");
  const [g] = await db.select().from(schema.giveaways).where(eq(schema.giveaways.id, id));
  if (!g || count < 1) redirect(`/admin/giveaways/${id}`);

  const already = (
    await db.select({ userId: schema.winners.userId }).from(schema.winners).where(eq(schema.winners.giveawayId, id))
  )
    .map((r) => r.userId)
    .filter((u): u is number => u !== null);

  const eligible = await db
    .select({ id: schema.users.id, name: schema.users.name, city: schema.users.city })
    .from(schema.progress)
    .innerJoin(schema.users, eq(schema.users.id, schema.progress.userId))
    .where(
      and(
        eq(schema.progress.giveawayId, id),
        gte(schema.progress.daysCompleted, g.haazriDays),
        eq(schema.users.isBlocked, false),
        already.length ? notInArray(schema.users.id, already) : undefined,
      ),
    );

  // Fisher–Yates with a cryptographic random source.
  const pool = [...eligible];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picked = pool.slice(0, count);
  if (picked.length === 0) redirect(`/admin/giveaways/${id}?error=no-eligible`);

  const [draw] = await db.insert(schema.draws).values({ giveawayId: id, eligibleCount: eligible.length, pickedUserIds: picked.map((p) => p.id) });
  const now = new Date();
  await db.insert(schema.winners).values(
    picked.map((p) => ({
      giveawayId: id,
      userId: p.id,
      drawId: draw.insertId,
      displayName: p.name || "Winner",
      town: p.city ?? "",
      prizeLabel: g.title,
      prizeValue: g.prizeValue,
      wonAt: now,
    })),
  );
  revalidatePath("/admin/winners");
  redirect(`/admin/winners?giveaway=${id}&drawn=${picked.length}`);
}

export async function setGiveawayStatus(fd: FormData) {
  await requireAdmin();
  const ids = fd.getAll("id").map(Number).filter(Boolean);
  const status = str(fd, "status") as (typeof GIVEAWAY_STATUSES)[number];
  if (!ids.length || !GIVEAWAY_STATUSES.includes(status)) return;
  await db.update(schema.giveaways).set({ status }).where(inArray(schema.giveaways.id, ids));
  revalidatePath("/admin/giveaways");
}
