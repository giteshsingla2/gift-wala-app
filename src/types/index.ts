// Shapes returned by the Gift Wala server (see server/src/app/api/v1 and docs/BACKEND.md).

export type TagStyle = 'daily' | 'weekly' | 'festival';
export type TaskType = 'website' | 'share' | 'ad';

export type Task = {
  day: number;
  type: TaskType;
  url: string | null;
  minSeconds: number | null;
  shareCount: number | null;
  shareMessage: string | null;
};

/** The logged-in user's standing in one giveaway. */
export type Progress = {
  daysCompleted: number;
  doneToday: boolean;
  finished: boolean;
  /** Day number the user does today (or just did). */
  currentDay: number;
  /** False when too few days are left before the last date to finish. */
  canFinish: boolean;
  daysLeft: number;
};

export type Giveaway = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  tileColorFrom: string;
  tileColorTo: string;
  categoryId: string | null;
  tag: string;
  tagStyle: TagStyle;
  winnersCount: number;
  prizeValue: number;
  haazriDays: number;
  startDate: string;
  lastDate: string;
  resultAt: string | null;
  featured: boolean;
  rulesText: string;
  progress: Progress | null;
  todayTask?: Task | null;
  running?: boolean;
};

export type Winner = {
  id: string;
  name: string;
  town: string;
  photoUrl: string | null;
  videoUrl: string | null;
  prizeLabel: string;
  prizeValue: number;
  prizeImageUrl: string | null;
  tileColorFrom: string;
  tileColorTo: string;
  wonAt: string;
};

export type Sections = {
  megaPoster: boolean;
  ticker: boolean;
  today: boolean;
  luckyWinners: boolean;
  whatsapp: boolean;
};

export type AppConfig = {
  whatsappChannelUrl: string;
  minAppVersion: string;
  sections: Sections;
  categories: { id: string; name: string }[];
};

export type User = {
  id: number;
  phone: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
  reminderEnabled: boolean;
  reminderTime: string;
};

export type HomeData = {
  featured: Giveaway | null;
  giveaways: Giveaway[];
  ticker: Winner[];
  pinned: Winner[];
  spotlight: Winner | null;
  yesterdayWinnersCount: number;
  wallet: number;
  sections: Sections;
  whatsappChannelUrl: string;
};

export type GiveawaysData = {
  featured: Giveaway | null;
  giveaways: Giveaway[];
  liveCount: number;
  doneTodayCount: number;
};

export type WinnersRange = 'yesterday' | 'week' | 'mega';

export type WinnersData = {
  spotlight: Winner | null;
  winners: Winner[];
  total: number;
};
