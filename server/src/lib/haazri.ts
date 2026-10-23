import { and, eq, isNull, sql } from "drizzle-orm";

import { db, schema } from "@/db";
import { istDate } from "./dates";
import { dayPlans, taskForDay, userState } from "./giveaways";
import { ApiError } from "./http";

async function loadLiveGiveaway(giveawayId: number, today: string) {
  const [g] = await db.select().from(schema.giveaways).where(eq(schema.giveaways.id, giveawayId));
  if (!g || g.status !== "live" || g.startDate > today || g.lastDate < today) {
    throw new ApiError(404, "not_running", "This giveaway is not running.");
  }
  return g;
}

/** Starts today's task for a giveaway. The server records the start time (used to time website tasks). */
export async function startHaazri(userId: number, giveawayId: number) {
  const today = istDate();
  const g = await loadLiveGiveaway(giveawayId, today);
  const [p] = await db
    .select()
    .from(schema.progress)
    .where(and(eq(schema.progress.userId, userId), eq(schema.progress.giveawayId, giveawayId)));
  const state = userState(g, p, today);
  if (state.finished) throw new ApiError(409, "finished", "You have completed every day for this giveaway.");
  if (state.doneToday) throw new ApiError(409, "done_today", "Today's haazri is already done. Come back tomorrow.");
  if (!state.canFinish) throw new ApiError(409, "too_late", "There aren't enough days left to finish this giveaway.");

  const task = taskForDay((await dayPlans([g.id])).get(g.id), state.currentDay);
  if (!task) throw new ApiError(409, "no_task", "This giveaway has no task set up yet.");

  const [res] = await db.insert(schema.haazriAttempts).values({
    userId,
    giveawayId,
    dayNumber: state.currentDay,
    taskType: task.taskType,
    dayDate: today,
  });
  return { attemptId: res.insertId, task, day: state.currentDay };
}

/** Completes a started task if its rule is met, and counts the day. */
export async function completeHaazri(userId: number, giveawayId: number, attemptId: number, sharesOpened?: number) {
  const today = istDate();
  const g = await loadLiveGiveaway(giveawayId, today);

  return db.transaction(async (tx) => {
    const [attempt] = await tx
      .select()
      .from(schema.haazriAttempts)
      .where(
        and(
          eq(schema.haazriAttempts.id, attemptId),
          eq(schema.haazriAttempts.userId, userId),
          eq(schema.haazriAttempts.giveawayId, giveawayId),
          isNull(schema.haazriAttempts.completedAt),
        ),
      )
      .for("update");
    if (!attempt) throw new ApiError(404, "no_attempt", "Start today's task first.");
    if (attempt.dayDate !== today) throw new ApiError(409, "expired", "That task was from another day. Start today's task.");

    const [task] = await tx
      .select()
      .from(schema.giveawayDays)
      .where(and(eq(schema.giveawayDays.giveawayId, giveawayId), eq(schema.giveawayDays.dayNumber, attempt.dayNumber)));
    const now = new Date();
    const secondsSpent = Math.floor((now.getTime() - attempt.startedAt.getTime()) / 1000);

    if (attempt.taskType === "website") {
      const min = task?.minSeconds ?? 30;
      if (secondsSpent < min) {
        throw new ApiError(409, "too_soon", `Stay on the website a little longer (${min - secondsSpent}s more).`, { secondsLeft: min - secondsSpent });
      }
    } else if (attempt.taskType === "share") {
      const need = task?.shareCount ?? 5;
      if ((sharesOpened ?? 0) < need) {
        throw new ApiError(409, "not_enough_shares", `Share with ${need} friends to finish today's haazri.`, { sharesNeeded: need });
      }
    } else if (!attempt.verifiedAt) {
      throw new ApiError(409, "ad_not_verified", "Watch the full ad to finish today's haazri.");
    }

    // Lock this user's progress row so a double tap can't count the day twice.
    await tx.insert(schema.progress).values({ userId, giveawayId, daysCompleted: 0 }).onDuplicateKeyUpdate({ set: { userId: sql`user_id` } });
    const [p] = await tx
      .select()
      .from(schema.progress)
      .where(and(eq(schema.progress.userId, userId), eq(schema.progress.giveawayId, giveawayId)))
      .for("update");
    if (p.lastDoneOn === today) throw new ApiError(409, "done_today", "Today's haazri is already done.");
    if (p.daysCompleted >= g.haazriDays) throw new ApiError(409, "finished", "You have completed every day for this giveaway.");

    const daysCompleted = p.daysCompleted + 1;
    await tx
      .update(schema.progress)
      .set({ daysCompleted, lastDoneOn: today, completedAt: daysCompleted >= g.haazriDays ? now : null })
      .where(and(eq(schema.progress.userId, userId), eq(schema.progress.giveawayId, giveawayId)));
    await tx
      .update(schema.haazriAttempts)
      .set({ completedAt: now, secondsSpent, sharesOpened: sharesOpened ?? null })
      .where(eq(schema.haazriAttempts.id, attempt.id));

    return userState(g, { ...p, daysCompleted, lastDoneOn: today }, today);
  });
}
