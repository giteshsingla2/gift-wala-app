import { requireUser } from "@/lib/app-auth";
import { istDate } from "@/lib/dates";
import { dayPlans, liveGiveaways, progressFor, serializeGiveaway, taskForDay, userState } from "@/lib/giveaways";
import { handle, json } from "@/lib/http";

// GET /api/v1/haazri — every running giveaway with the user's progress and today's task.
// Featured (Mega Draw) first, then the giveaways the user has already started.
export const GET = handle(async (request: Request) => {
  const user = await requireUser(request);
  const today = istDate();
  const live = await liveGiveaways(today);
  const ids = live.map((g) => g.id);
  const [progress, plans] = await Promise.all([progressFor(user.id, ids), dayPlans(ids)]);
  const items = live.map((g) => {
    const state = userState(g, progress.get(g.id), today);
    return serializeGiveaway(request, g, state, taskForDay(plans.get(g.id), state.currentDay));
  });
  items.sort((a, b) => Number(b.featured) - Number(a.featured) || (b.progress?.daysCompleted ?? 0) - (a.progress?.daysCompleted ?? 0));
  return json({ giveaways: items });
});
