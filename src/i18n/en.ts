// Every user-facing string lives here so the Hindi version can be a drop-in file.

export const en = {
  appName: 'Gift Wala',
  appNameCaps: 'GIFT WALA',
  rupees: (amount: number) => `₹${amount}`,

  nav: {
    home: 'Home',
    giveaways: 'Giveaways',
    haazri: 'Haazri',
    winners: 'Winners',
    profile: 'Profile',
  },

  a11y: {
    back: 'Back',
    notifications: 'Notifications',
    share: 'Share giveaway',
    whatsappShare: 'Share on WhatsApp',
    wallet: (amount: number) => `Wallet: ₹${amount}`,
  },

  common: {
    loading: 'Loading…',
    loadFailed: 'Could not load. Check your internet.',
    retry: 'Try again',
    winners: (n: number) => `${n} winners`,
    winnersToday: (n: number) => `${n} winners today`,
    dot: ' · ',
    yesterday: 'Yesterday',
    on: 'On',
    off: 'Off',
  },

  countdown: {
    days: 'days',
    hrs: 'hrs',
    min: 'min',
    resultIn: 'Result in',
    endsIn: (hms: string) => `Ends in ${hms}`,
  },

  home: {
    megaDraw: 'MEGA DRAW',
    featuredTitle: (prize: string) => `Win ${prize}`,
    featuredSubtitle: (days: number) => `Free entry after ${days} days of haazri`,
    ticker: (name: string, town: string, prize: string) => ({ name, rest: ` from ${town} won ${prize}` }),
    minutesAgo: (m: number) => (m < 60 ? `${m}m ago` : `${Math.floor(m / 60)}h ago`),
    dailyHaazri: 'Daily haazri',
    haazriProgress: (day: number, total: number, left: number, prize: string) =>
      `Day ${day} of ${total} · ${left} days to the ${prize} draw`,
    markHaazri: "Mark today's haazri",
    haazriDoneToday: 'Haazri done for today',
    todaysGiveaways: "Today's giveaways",
    live: 'LIVE',
    seeAll: 'See all',
    enterFree: 'Enter free',
    entered: 'Entered',
    luckyWinners: 'Lucky winners',
    wonBy: (prize: string) => `${prize} won by`,
    watchVideo: 'Watch video',
    moreWinners: 'MORE WINNERS',
    peopleCount: (n: number) => `${n} people`,
    wonDailyYesterday: 'won daily rewards yesterday',
    whatsappTitle: 'Results on WhatsApp',
    whatsappBody: 'Join the channel to see winners first',
    joinChannel: 'Join channel',
  },

  haazri: {
    title: 'Daily haazri',
    freeSkips: (n: number) => (n === 1 ? '1 free skip' : `${n} free skips`),
    noSkips: 'No skips left',
    day: 'DAY',
    moreDays: (n: number) => (n === 1 ? '1 more day' : `${n} more days`),
    unlocks: (title: string) => `and you get a free entry in the ${title} draw`,
    qualified: 'You are in the draw!',
    qualifiedBody: (title: string) => `You have a free entry in the ${title} draw`,
    today: 'TODAY',
    prizeDraw: (prize: string) => `${prize.toUpperCase()} DRAW`,
    openTill: 'Open till 11:59 PM tonight',
    doneToday: 'Done for today. Come back tomorrow.',
    remind: 'Remind me daily at 9 AM',
    switcherLabel: (title: string, done: number, total: number) => `${title} · ${done}/${total}`,
    pathLabel: (done: number, today: number, total: number, prize: string) =>
      `Haazri path: ${done} days done, day ${today} is today, day ${total} is the ${prize} draw entry`,
    markFailed: 'Could not mark haazri. Check your internet and try again.',
  },

  haazriDone: {
    title: 'Haazri marked',
    body: (day: number) => `Day ${day} is done. Come back tomorrow\nfor day ${day + 1} and keep your streak.`,
    qualifiedTitle: "You're in the draw!",
    qualifiedBody: (prize: string) => `You finished every day. Your free entry in the ${prize} draw is confirmed.`,
    seeGiveaways: "See today's giveaways",
    peopleWon: (prize: string) => `won ${prize}`,
    shareMessage: (appName: string) =>
      `I just marked my daily haazri on ${appName}. Free giveaways every day, no fees ever. Join me!`,
  },

  giveaways: {
    title: 'Giveaways',
    subtitle: 'Everything running now. All free to enter.',
    liveCount: (n: number) => `${n} live`,
    filters: {
      all: 'All',
      recharge: 'Recharge',
      cash: 'Cash',
      data: 'Data',
      product: 'Products',
      festival: 'Festival',
    },
    megaSubtitle: (days: number, result: string) => `Free entry after ${days} days of haazri. Result ${result}.`,
    continueHaazri: 'Continue haazri',
    runningNow: 'Running now',
    enteredCount: (entered: number, total: number) => `You entered ${entered} of ${total}`,
    enter: 'Enter',
    entered: 'Entered',
    meta: (winners: number, ends: string) => `${winners} winners · Ends ${ends}`,
    empty: 'Nothing running in this category right now. Check back tomorrow morning.',
    alertsTitle: 'New giveaways every morning',
    alertsBody: 'Turn on alerts so you never miss one',
  },

  detail: {
    howToEnter: 'How to enter',
    steps: [
      { title: 'Tap Enter now', body: 'Takes one second' },
      { title: 'Finish the short task', body: 'It opens on our website' },
      { title: 'Check result tomorrow', body: 'Winners list goes up at 10 AM' },
    ],
    freeBanner: '100% free. You never pay to enter.',
    rules: 'Rules',
    enterNow: 'Enter now',
    free: 'FREE',
    youreIn: "You're in",
    youreInBody: 'Entry confirmed. Result tomorrow at 10 AM.',
    shareMessage: (title: string, appName: string) => `Win ${title} free on ${appName}. No fees, ever.`,
    enterFailed: 'Could not open the entry page. Check your internet and try again.',
    haazriEntry: 'Enter by marking haazri',
    rulesTitle: 'Rules',
    rechargeDone: 'RECHARGE DONE',
  },

  winners: {
    title: 'Winners',
    allVerified: 'All verified',
    ranges: { yesterday: 'Yesterday', week: 'This week', mega: 'Mega draw' },
    wonPrefix: 'won ',
    dailyWinners: 'Daily giveaway winners',
    weekWinners: 'This week’s winners',
    megaWinners: 'Mega draw winners',
    total: (n: number) => `${n} winners`,
  },

  profile: {
    title: 'Profile',
    comingSoon: 'Your entries, results and prize claims will show here.',
  },

  trust: {
    adsPayForPrizes: 'Prizes are paid for by ads. Entry is always free.',
  },

  dates: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    monthsLong: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    am: 'AM',
    pm: 'PM',
    today: 'Today',
    yesterday: 'Yesterday',
    draw: (month: string) => `${month} draw`,
    megaDraw: (month: string) => `${month} mega draw`,
  },
} as const;

export type Strings = typeof en;
