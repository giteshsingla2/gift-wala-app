// PLACEHOLDER DATA FOR DEVELOPMENT ONLY.
// Every name, town, prize, count and amount here comes from the design mockups. None of these
// people are real winners. Replace this file with the real API before any public release:
// the app must only ever show real, verified winners.

import type { Giveaway, HaazriProgress, Winner } from '@/types';

const now = new Date();
const atToday = (h: number, m: number) =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m).toISOString();
const daysFromNow = (d: number, h = 22, m = 0) =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate() + d, h, m).toISOString();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();
const nextSunday = () => daysFromNow(((7 - now.getDay()) % 7) || 7, 23, 59);

const TASK_URL = 'https://example.com/enter';

const base = {
  subtitle: '',
  startsAt: daysFromNow(-1, 0, 0),
  entered: false,
  featured: false,
  entryType: 'task' as const,
  taskUrl: TASK_URL,
  rulesText:
    'One entry per person per day. Entry is free: we never ask for money, fees or delivery charges. ' +
    'Winners are picked by a random computer draw and shown live. Prizes are paid for by ads.',
};

export const giveaways: Giveaway[] = [
  {
    ...base,
    id: 'iphone-16-mega',
    title: 'iPhone 16',
    subtitle: 'Mark haazri for 10 days to get a free entry',
    art: 'iphone',
    tileColorFrom: '#13246B',
    tileColorTo: '#2B4DE0',
    category: 'mega',
    tag: 'MEGA DRAW',
    tagStyle: 'festival',
    winnersCount: 1,
    endsAt: daysFromNow(11, 18, 42),
    resultAt: daysFromNow(11, 18, 42),
    entryType: 'haazri',
    taskUrl: undefined,
    haazriDays: 10,
    freeSkips: 1,
    featured: true,
    sortOrder: 0,
  },
  {
    ...base,
    id: 'recharge-20',
    title: '₹20 recharge',
    subtitle: 'Any mobile number, any operator',
    art: 'recharge',
    tileColorFrom: '#FFE7A3',
    tileColorTo: '#FFB938',
    category: 'recharge',
    tag: 'DAILY',
    tagStyle: 'daily',
    winnersCount: 50,
    endsAt: atToday(23, 59),
    resultAt: daysFromNow(1, 10, 0),
    sortOrder: 1,
    entered: true,
  },
  {
    ...base,
    id: 'upi-10',
    title: '₹10 UPI cash',
    subtitle: 'Sent straight to your UPI ID',
    art: 'cash',
    tileColorFrom: '#CFF7E2',
    tileColorTo: '#5ED69A',
    category: 'cash',
    tag: 'DAILY',
    tagStyle: 'daily',
    winnersCount: 100,
    endsAt: atToday(23, 59),
    resultAt: daysFromNow(1, 10, 0),
    sortOrder: 2,
  },
  {
    ...base,
    id: 'data-1-5gb',
    title: '1.5 GB data',
    subtitle: 'Data pack on any operator',
    art: 'data',
    tileColorFrom: '#E1E7FF',
    tileColorTo: '#93A9FF',
    category: 'data',
    tag: 'DAILY',
    tagStyle: 'daily',
    winnersCount: 30,
    endsAt: atToday(23, 59),
    resultAt: daysFromNow(1, 10, 0),
    sortOrder: 3,
  },
  {
    ...base,
    id: 'diwali-501',
    title: '₹501 cash',
    subtitle: 'Diwali special, sent to your UPI ID',
    art: 'diya',
    tileColorFrom: '#7A1F2B',
    tileColorTo: '#C2410C',
    category: 'festival',
    tag: 'DIWALI SPECIAL',
    tagStyle: 'festival',
    winnersCount: 21,
    endsAt: '2026-11-08T23:59:00+05:30',
    resultAt: '2026-11-09T10:00:00+05:30',
    sortOrder: 4,
  },
  {
    ...base,
    id: 'recharge-100-weekly',
    title: '₹100 recharge',
    subtitle: 'Any mobile number, any operator',
    art: 'weeklyRecharge',
    tileColorFrom: '#F3E1FF',
    tileColorTo: '#C084FC',
    category: 'recharge',
    tag: 'WEEKLY',
    tagStyle: 'weekly',
    winnersCount: 10,
    endsAt: nextSunday(),
    resultAt: nextSunday(),
    sortOrder: 5,
  },
  {
    ...base,
    id: 'earbuds-weekly',
    title: 'Bluetooth earbuds',
    subtitle: 'Delivered free to your home',
    art: 'earbuds',
    tileColorFrom: '#D5FBF6',
    tileColorTo: '#4FD1C5',
    category: 'product',
    tag: 'WEEKLY',
    tagStyle: 'weekly',
    winnersCount: 5,
    endsAt: nextSunday(),
    resultAt: nextSunday(),
    sortOrder: 6,
  },
  {
    ...base,
    id: 'watch-weekly',
    title: 'Smart watch',
    subtitle: 'Delivered free to your home',
    art: 'watch',
    tileColorFrom: '#FFE4EC',
    tileColorTo: '#FB7299',
    category: 'product',
    tag: 'WEEKLY',
    tagStyle: 'weekly',
    winnersCount: 3,
    endsAt: nextSunday(),
    resultAt: nextSunday(),
    sortOrder: 7,
  },
];

export const haazri: HaazriProgress[] = [
  {
    giveawayId: 'iphone-16-mega',
    prizeShortName: 'iPhone',
    title: 'iPhone 16',
    haazriDays: 10,
    daysMarked: 3,
    freeSkips: 1,
    skipsUsed: 0,
    markedToday: false,
    closesAt: atToday(23, 59),
  },
];

export const megaWinner: Winner = {
  id: 'w-mega-sep',
  firstName: 'Sunita',
  lastName: 'Devi',
  town: 'Bareilly',
  prizeLabel: 'iPhone 15',
  art: 'iphoneBlue',
  wonAt: '2026-09-30T18:00:00+05:30',
  drawLabel: 'September',
  videoUrl: 'https://example.com/winner-video',
};

export const winnersYesterday: Winner[] = [
  { id: 'w1', firstName: 'Pooja', lastName: 'Yadav', town: 'Azamgarh', prizeLabel: '₹20 recharge', art: 'recharge', wonAt: daysFromNow(-1, 21, 0) },
  { id: 'w2', firstName: 'Mohd.', lastName: 'Arif', town: 'Rampur', prizeLabel: '₹10 UPI cash', art: 'cash', wonAt: daysFromNow(-1, 21, 0) },
  { id: 'w3', firstName: 'Deepak', lastName: 'Verma', town: 'Sitapur', prizeLabel: '1.5 GB data', art: 'data', wonAt: daysFromNow(-1, 21, 0) },
];

export const winnersWeek: Winner[] = [
  { id: 'w4', firstName: 'Ravi', lastName: 'Kumar', town: 'Gonda', prizeLabel: 'Bluetooth earbuds', art: 'earbuds', wonAt: daysFromNow(-3, 20, 0) },
  { id: 'w5', firstName: 'Anjali', lastName: 'Singh', town: 'Ballia', prizeLabel: 'Smart watch', art: 'watch', wonAt: daysFromNow(-3, 20, 0) },
  { id: 'w6', firstName: 'Suresh', lastName: 'Pal', town: 'Basti', prizeLabel: '₹100 recharge', art: 'weeklyRecharge', wonAt: daysFromNow(-3, 20, 0) },
  ...winnersYesterday,
];

export const winnersMega: Winner[] = [
  megaWinner,
  { id: 'w7', firstName: 'Imran', lastName: 'Khan', town: 'Bahraich', prizeLabel: 'iPhone 14', art: 'iphoneBlue', wonAt: '2026-08-31T18:00:00+05:30', drawLabel: 'August' },
];

export const tickerWinners = [
  { ...winnersYesterday[0], wonAt: minutesAgo(2) },
  { ...winnersYesterday[1], wonAt: minutesAgo(9) },
  { ...winnersYesterday[2], wonAt: minutesAgo(17) },
];

export const totals = {
  yesterdayWinners: 180,
  weekWinners: 1240,
  megaWinners: 2,
  peopleWonUpi: 100,
  peopleWonUpiPrize: '₹10 UPI cash',
  walletTotal: 40,
  unreadNotifications: 1,
};
