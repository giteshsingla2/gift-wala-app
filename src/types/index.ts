// Mirrors the API / database model in the design handoff.

export type GiveawayCategory = 'recharge' | 'cash' | 'data' | 'product' | 'festival' | 'mega';
export type TagStyle = 'daily' | 'weekly' | 'festival';
export type EntryType = 'task' | 'haazri';

// Placeholder drawings used until the server sends a real product image.
export type PrizeArt =
  | 'recharge'
  | 'cash'
  | 'data'
  | 'weeklyRecharge'
  | 'earbuds'
  | 'watch'
  | 'diya'
  | 'iphone'
  | 'iphoneBlue'
  | 'coins'
  | 'coinStack';

export type Giveaway = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  art: PrizeArt;
  tileColorFrom: string;
  tileColorTo: string;
  category: GiveawayCategory;
  tag: string;
  tagStyle: TagStyle;
  winnersCount: number;
  startsAt: string;
  endsAt: string;
  resultAt: string;
  entryType: EntryType;
  taskUrl?: string;
  haazriDays?: number;
  freeSkips?: number;
  featured: boolean;
  sortOrder: number;
  rulesText: string;
  entered: boolean;
};

export type HaazriProgress = {
  giveawayId: string;
  prizeShortName: string;
  title: string;
  haazriDays: number;
  daysMarked: number;
  freeSkips: number;
  skipsUsed: number;
  markedToday: boolean;
  closesAt: string;
};

export type Winner = {
  id: string;
  firstName: string;
  lastName?: string;
  town: string;
  photoUrl?: string;
  prizeLabel: string;
  art: PrizeArt;
  wonAt: string;
  drawLabel?: string;
  videoUrl?: string;
};

export type WinnerSummary = {
  count: number;
  prizeLabel?: string;
  art?: PrizeArt;
};

export type HomeData = {
  featured: Giveaway;
  haazri: HaazriProgress;
  today: Giveaway[];
  megaWinner: Winner;
  recentWinners: Winner[];
  yesterdayWinnersCount: number;
  walletTotal: number;
  unreadNotifications: number;
};

export type WinnersRange = 'yesterday' | 'week' | 'mega';

export type WinnersData = {
  spotlight: Winner;
  winners: Winner[];
  total: number;
};
