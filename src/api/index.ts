// App-side API. Each function matches an endpoint in the design handoff.
// For now they answer from in-memory placeholder data; swap the bodies for fetch calls to the
// real server. Screens only depend on these signatures.

import type { Giveaway, GiveawayCategory, HaazriProgress, HomeData, WinnersData, WinnersRange } from '@/types';
import * as mock from './mock-data';

const delay = <T>(value: T, ms = 250) => new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const liveGiveaways = () =>
  mock.giveaways
    .filter((g) => new Date(g.endsAt).getTime() > Date.now())
    .sort((a, b) => a.sortOrder - b.sortOrder);

// GET /home
export function getHome(): Promise<HomeData> {
  const live = liveGiveaways();
  const featured = live.find((g) => g.featured)!;
  return delay(
    clone({
      featured,
      haazri: mock.haazri.find((h) => h.giveawayId === featured.id)!,
      today: live.filter((g) => g.tagStyle === 'daily'),
      megaWinner: mock.megaWinner,
      recentWinners: mock.tickerWinners,
      yesterdayWinnersCount: mock.totals.yesterdayWinners,
      walletTotal: mock.totals.walletTotal,
      unreadNotifications: mock.totals.unreadNotifications,
    }),
  );
}

// GET /giveaways?category=
export function getGiveaways(category?: GiveawayCategory) {
  const live = liveGiveaways();
  const running = live.filter((g) => !g.featured && (!category || g.category === category));
  const featured = live.find((g) => g.featured);
  return delay(
    clone({
      featured,
      featuredHaazri: mock.haazri.find((h) => h.giveawayId === featured?.id),
      running,
      liveCount: live.length,
      enteredCount: live.filter((g) => !g.featured && g.entered).length,
      totalCount: live.filter((g) => !g.featured).length,
    }),
  );
}

// GET /giveaways/:id
export function getGiveaway(id: string): Promise<Giveaway | undefined> {
  return delay(clone(mock.giveaways.find((g) => g.id === id)));
}

// POST /giveaways/:id/enter -> signed one-time task URL.
// The real entry is recorded only when the website's server calls the task-complete webhook.
export function enterGiveaway(id: string): Promise<{ taskUrl: string }> {
  const g = mock.giveaways.find((x) => x.id === id);
  if (!g?.taskUrl) return Promise.reject(new Error('Giveaway has no task'));
  return delay({ taskUrl: `${g.taskUrl}?giveaway=${encodeURIComponent(id)}&token=demo-one-time-token` });
}

// Development stand-in for the server-to-server webhook confirming the task.
export function simulateTaskConfirmed(id: string) {
  const g = mock.giveaways.find((x) => x.id === id);
  if (g) g.entered = true;
}

// GET /haazri
export function getHaazri(): Promise<HaazriProgress[]> {
  return delay(clone(mock.haazri));
}

// POST /haazri/mark. One tap marks today for every haazri giveaway the user joined.
// The server decides what "today" is (Asia/Kolkata), never the phone clock.
export function markHaazri(): Promise<HaazriProgress[]> {
  for (const h of mock.haazri) {
    if (!h.markedToday && h.daysMarked < h.haazriDays) {
      h.daysMarked += 1;
      h.markedToday = true;
    }
  }
  return delay(clone(mock.haazri), 400);
}

// GET /winners?range=
export function getWinners(range: WinnersRange): Promise<WinnersData> {
  const lists = {
    yesterday: { winners: mock.winnersYesterday, total: mock.totals.yesterdayWinners },
    week: { winners: mock.winnersWeek, total: mock.totals.weekWinners },
    mega: { winners: mock.winnersMega, total: mock.totals.megaWinners },
  } as const;
  return delay(clone({ spotlight: mock.megaWinner, ...lists[range] }));
}

export const placeholderTotals = mock.totals;
