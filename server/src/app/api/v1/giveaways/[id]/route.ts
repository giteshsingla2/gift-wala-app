import { and, desc, eq } from "drizzle-orm";

import { db, schema } from "@/db";
import { requireUser } from "@/lib/app-auth";
import { istDate } from "@/lib/dates";
import { dayPlans, progressFor, serializeGiveaway, taskForDay, userState } from "@/lib/giveaways";
import { ApiError, handle, json } from "@/lib/http";
import { serializeWinner } from "@/lib/winners";

// GET /api/v1/giveaways/:id — detail with the user's progress, today's task and past winners.
export const GET = handle(async (request: Request, ctx: RouteContext<"/api/v1/giveaways/[id]">) => {
  const user = await requireUser(request);
  const id = Number((await ctx.params).id);
  const [g] = await db.select().from(schema.giveaways).where(eq(schema.giveaways.id, id));
  if (!g || g.status === "draft") throw new ApiError(404, "not_found", "Giveaway not found.");

  const today = istDate();
  const [progress, plans, pastWinners] = await Promise.all([
    progressFor(user.id, [g.id]),
    dayPlans([g.id]),
    db
      .select({
        winner: schema.winners,
        giveawayImage: schema.giveaways.imageUrl,
        tileColorFrom: schema.giveaways.tileColorFrom,
        tileColorTo: schema.giveaways.tileColorTo,
      })
      .from(schema.winners)
      .innerJoin(schema.giveaways, eq(schema.giveaways.id, schema.winners.giveawayId))
      .where(and(eq(schema.winners.giveawayId, g.id), eq(schema.winners.isPublished, true)))
      .orderBy(desc(schema.winners.wonAt))
      .limit(20),
  ]);
  const state = userState(g, progress.get(g.id), today);
  const running = g.status === "live" && g.startDate <= today && g.lastDate >= today;

  return json({
    giveaway: { ...serializeGiveaway(request, g, state, taskForDay(plans.get(g.id), state.currentDay)), running },
    winners: pastWinners.map((r) => serializeWinner(request, r)),
  });
});
