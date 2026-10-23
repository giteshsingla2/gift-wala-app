import type { Giveaway } from '@/types';

// What the user can do with a giveaway right now.
export type GiveawayAction = 'start' | 'doToday' | 'doneToday' | 'inDraw' | 'tooLate';

export function giveawayAction(g: Giveaway): GiveawayAction {
  const p = g.progress;
  if (!p) return 'start';
  if (p.finished) return 'inDraw';
  if (p.doneToday) return 'doneToday';
  if (!p.canFinish) return 'tooLate';
  return p.daysCompleted === 0 ? 'start' : 'doToday';
}

/** Today's task can be started. */
export const canDoToday = (g: Giveaway) => ['start', 'doToday'].includes(giveawayAction(g));
