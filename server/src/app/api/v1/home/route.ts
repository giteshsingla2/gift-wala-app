import { requireUser } from "@/lib/app-auth";
import { istDate } from "@/lib/dates";
import { dayPlans, liveGiveaways, progressFor, serializeGiveaway, taskForDay, userState } from "@/lib/giveaways";
import { handle, json } from "@/lib/http";
import { getSettings } from "@/lib/settings";
import { latestWinners, pinnedWinners, serializeWinner, spotlightWinner, walletTotal, yesterdayWinnerCount } from "@/lib/winners";

// GET /api/v1/home
export const GET = handle(async (request: Request) => {
  const user = await requireUser(request);
  const today = istDate();
  const live = await liveGiveaways(today);
  const ids = live.map((g) => g.id);
  const [progress, plans, ticker, pinned, spotlight, yesterdayCount, wallet, settings] = await Promise.all([
    progressFor(user.id, ids),
    dayPlans(ids),
    latestWinners(10),
    pinnedWinners(),
    spotlightWinner(),
    yesterdayWinnerCount(),
    walletTotal(user.id),
    getSettings(),
  ]);

  const serialize = (g: (typeof live)[number]) => {
    const state = userState(g, progress.get(g.id), today);
    return serializeGiveaway(request, g, state, taskForDay(plans.get(g.id), state.currentDay));
  };
  const featured = live.find((g) => g.isFeatured);

  return json({
    featured: featured ? serialize(featured) : null,
    giveaways: live.filter((g) => g !== featured).map(serialize),
    ticker: ticker.map((r) => serializeWinner(request, r)),
    pinned: pinned.map((r) => serializeWinner(request, r)),
    spotlight: spotlight ? serializeWinner(request, spotlight) : null,
    yesterdayWinnersCount: yesterdayCount,
    wallet,
    sections: settings.sections,
    whatsappChannelUrl: settings.whatsappChannelUrl,
  });
});
