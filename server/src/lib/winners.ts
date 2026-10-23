import { and, desc, eq, gte, lt, sql } from "drizzle-orm";

import { db, schema } from "@/db";
import { addDays, istDate, istMidnightUtc } from "./dates";
import { absUrl } from "./http";

// Only published winners ever reach the app. Phone numbers are never included.

const winnerColumns = {
  winner: schema.winners,
  giveawayImage: schema.giveaways.imageUrl,
  tileColorFrom: schema.giveaways.tileColorFrom,
  tileColorTo: schema.giveaways.tileColorTo,
};

type WinnerRow = {
  winner: typeof schema.winners.$inferSelect;
  giveawayImage: string | null;
  tileColorFrom: string;
  tileColorTo: string;
};

function publishedQuery() {
  return db
    .select(winnerColumns)
    .from(schema.winners)
    .innerJoin(schema.giveaways, eq(schema.giveaways.id, schema.winners.giveawayId))
    .$dynamic();
}

export function serializeWinner(request: Request, r: WinnerRow) {
  const w = r.winner;
  return {
    id: String(w.id),
    name: w.displayName,
    town: w.town,
    photoUrl: absUrl(request, w.photoUrl),
    videoUrl: w.videoUrl || null,
    prizeLabel: w.prizeLabel,
    prizeValue: w.prizeValue,
    prizeImageUrl: absUrl(request, r.giveawayImage),
    tileColorFrom: r.tileColorFrom,
    tileColorTo: r.tileColorTo,
    wonAt: w.wonAt.toISOString(),
  };
}

export async function latestWinners(limit: number) {
  return publishedQuery().where(eq(schema.winners.isPublished, true)).orderBy(desc(schema.winners.wonAt)).limit(limit);
}

export async function pinnedWinners() {
  return publishedQuery()
    .where(and(eq(schema.winners.isPublished, true), eq(schema.winners.isPinnedHome, true)))
    .orderBy(schema.winners.sortOrder, desc(schema.winners.wonAt));
}

export async function spotlightWinner() {
  const [row] = await publishedQuery()
    .where(and(eq(schema.winners.isPublished, true), eq(schema.winners.isSpotlight, true)))
    .orderBy(desc(schema.winners.wonAt))
    .limit(1);
  return row ?? null;
}

/** Published winners won in [fromDay, toDay) India dates. */
async function winnersBetween(fromDay: string, toDay: string) {
  const range = and(
    eq(schema.winners.isPublished, true),
    gte(schema.winners.wonAt, istMidnightUtc(fromDay)),
    lt(schema.winners.wonAt, istMidnightUtc(toDay)),
  );
  const [rows, [{ total }]] = await Promise.all([
    publishedQuery().where(range).orderBy(schema.winners.sortOrder, desc(schema.winners.wonAt)).limit(100),
    db.select({ total: sql<number>`count(*)` }).from(schema.winners).where(range),
  ]);
  return { rows, total: Number(total) };
}

export async function winnersForRange(range: "yesterday" | "week" | "mega") {
  const today = istDate();
  if (range === "yesterday") return winnersBetween(addDays(today, -1), today);
  if (range === "week") return winnersBetween(addDays(today, -7), addDays(today, 1));
  const rows = await publishedQuery()
    .where(and(eq(schema.winners.isPublished, true), eq(schema.winners.isSpotlight, true)))
    .orderBy(desc(schema.winners.wonAt))
    .limit(100);
  return { rows, total: rows.length };
}

export async function yesterdayWinnerCount() {
  const today = istDate();
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(schema.winners)
    .where(
      and(
        eq(schema.winners.isPublished, true),
        gte(schema.winners.wonAt, istMidnightUtc(addDays(today, -1))),
        lt(schema.winners.wonAt, istMidnightUtc(today)),
      ),
    );
  return Number(total);
}

export async function walletTotal(userId: number) {
  const [{ total }] = await db
    .select({ total: sql<number>`coalesce(sum(${schema.winners.prizeValue}), 0)` })
    .from(schema.winners)
    .where(and(eq(schema.winners.userId, userId), eq(schema.winners.isPublished, true)));
  return Number(total);
}

export async function userWins(userId: number) {
  return publishedQuery()
    .where(and(eq(schema.winners.userId, userId), eq(schema.winners.isPublished, true)))
    .orderBy(desc(schema.winners.wonAt));
}
