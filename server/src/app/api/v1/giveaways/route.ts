import { requireUser } from "@/lib/app-auth";
import { istDate } from "@/lib/dates";
import { liveGiveaways, progressFor, serializeGiveaway, userState } from "@/lib/giveaways";
import { handle, json } from "@/lib/http";

// GET /api/v1/giveaways?category=<id>
export const GET = handle(async (request: Request) => {
  const user = await requireUser(request);
  const today = istDate();
  const category = Number(new URL(request.url).searchParams.get("category")) || undefined;
  const [all, filtered] = await Promise.all([liveGiveaways(today), category ? liveGiveaways(today, category) : null]);
  const list = filtered ?? all;
  const progress = await progressFor(
    user.id,
    all.map((g) => g.id),
  );
  const states = new Map(all.map((g) => [g.id, userState(g, progress.get(g.id), today)]));
  const featured = all.find((g) => g.isFeatured);

  return json({
    featured: featured ? serializeGiveaway(request, featured, states.get(featured.id)) : null,
    giveaways: list.filter((g) => g !== featured && g.id !== featured?.id).map((g) => serializeGiveaway(request, g, states.get(g.id))),
    liveCount: all.length,
    doneTodayCount: all.filter((g) => states.get(g.id)?.doneToday).length,
  });
});
