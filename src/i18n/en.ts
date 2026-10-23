// Every user-facing string lives here so the Hindi version can be a drop-in file.
// Giveaway titles, prizes and winner names come from the server.

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export const en = {
  appName: 'Gift Wala',
  appNameCaps: 'GIFT WALA',
  rupees: (amount: number) => `₹${amount.toLocaleString('en-IN')}`,

  nav: {
    home: 'Home',
    giveaways: 'Giveaways',
    haazri: 'Haazri',
    winners: 'Winners',
    profile: 'Profile',
  },

  a11y: {
    back: 'Back',
    share: 'Share giveaway',
    whatsappShare: 'Share on WhatsApp',
    wallet: (amount: number) => `Total winnings: ₹${amount}`,
  },

  common: {
    loading: 'Loading…',
    loadFailed: 'Could not load. Check your internet.',
    offline: 'No internet. Check your connection and try again.',
    retry: 'Try again',
    ok: 'OK',
    cancel: 'Cancel',
    winners: (n: number) => `${n} ${plural(n, 'winner', 'winners')}`,
    dot: ' · ',
  },

  login: {
    title: 'Welcome to Gift Wala',
    subtitle: 'Free giveaways every day. Enter your mobile number to start.',
    phoneLabel: 'Mobile number',
    phonePlaceholder: '10-digit mobile number',
    continue: 'Continue',
    invalid: 'Enter a valid 10-digit mobile number.',
    free: '100% free. We never ask for money.',
  },

  update: {
    title: 'Please update Gift Wala',
    body: 'This version is too old. Update from the Play Store to keep taking part in giveaways.',
    button: 'Open Play Store',
  },

  countdown: {
    days: 'days',
    hrs: 'hrs',
    min: 'min',
    resultIn: 'Result in',
  },

  task: {
    title: { share: (n: number) => `Share with ${n} ${plural(n, 'friend', 'friends')}`, website: 'Visit our website', ad: 'Watch a short ad' },
    body: {
      share: 'Share Gift Wala on WhatsApp or anywhere you like. Each share counts.',
      website: (s: number) => `Open the page and stay at least ${s} seconds, then come back here.`,
      ad: 'Watch the full ad to finish today’s haazri.',
    },
    shareButton: 'Share now',
    sharesDone: (done: number, total: number) => `${done} of ${total} shared`,
    websiteButton: 'Open website',
    adButton: 'Watch ad',
    adComingSoon: 'Reward ads are coming soon. This day can’t be completed in this version of the app yet.',
    shareMessage: (title: string, appName: string) => `I'm taking part in the ${title} giveaway on ${appName}. Entry is 100% free. Join me!`,
    counting: 'Checking…',
    tooSoon: 'Stay on the website a little longer, then come back.',
    tryAgain: 'Open again',
    close: 'Close',
  },

  home: {
    megaDraw: 'MEGA DRAW',
    featuredTitle: (prize: string) => `Win ${prize}`,
    featuredSubtitle: (days: number) => `Free entry after ${days} ${plural(days, 'day', 'days')} of haazri`,
    lastDate: (date: string) => `Last date ${date}`,
    ticker: (name: string, town: string, prize: string) => ({ name, rest: town ? ` from ${town} won ${prize}` : ` won ${prize}` }),
    minutesAgo: (m: number) => (m < 60 ? `${m}m ago` : m < 1440 ? `${Math.floor(m / 60)}h ago` : `${Math.floor(m / 1440)}d ago`),
    dailyHaazri: 'Daily haazri',
    haazriProgress: (day: number, total: number, left: number, prize: string) =>
      left > 0 ? `Day ${day} of ${total} · ${left} ${plural(left, 'day', 'days')} to the ${prize} draw` : `Last day for the ${prize} draw`,
    doHaazri: "Do today's haazri",
    haazriDoneToday: 'Haazri done for today',
    inTheDraw: "You're in the draw",
    todaysGiveaways: 'Running giveaways',
    live: 'LIVE',
    seeAll: 'See all',
    luckyWinners: 'Lucky winners',
    wonBy: (prize: string) => `${prize} won by`,
    watchVideo: 'Watch video',
    moreWinners: 'MORE WINNERS',
    peopleCount: (n: number) => `${n} ${plural(n, 'person', 'people')}`,
    wonYesterday: 'won prizes yesterday',
    seeAllWinners: 'See all winners',
    whatsappTitle: 'Results on WhatsApp',
    whatsappBody: 'Join the channel to see winners first',
    joinChannel: 'Join channel',
    nothingRunning: 'No giveaways are running right now. New ones start soon, check back tomorrow.',
  },

  card: {
    start: 'Start',
    doToday: 'Do today',
    doneToday: 'Done today',
    inDraw: 'In the draw',
    tooLate: 'Closed',
    dayOf: (done: number, total: number) => `Day ${done}/${total}`,
  },

  haazri: {
    title: 'Daily haazri',
    day: 'DAY',
    moreDays: (n: number) => `${n} more ${plural(n, 'day', 'days')}`,
    unlocks: (title: string) => `and you get a free entry in the ${title} draw`,
    qualified: "You're in the draw!",
    qualifiedBody: (title: string) => `You finished every day. Your free entry in the ${title} draw is confirmed.`,
    tooLate: 'Too late to finish',
    tooLateBody: (left: number, needed: number) =>
      `Only ${left} ${plural(left, 'day is', 'days are')} left but you need ${needed}. Try another giveaway.`,
    today: 'TODAY',
    prizeDraw: (prize: string) => (prize.length <= 10 ? `${prize.toUpperCase()} DRAW` : 'PRIZE DRAW'),
    lastDate: (date: string) => `Last date: ${date}`,
    doneToday: 'Done for today. Come back tomorrow.',
    remind: (time: string) => `Remind me daily at ${time}`,
    switcherLabel: (title: string, done: number, total: number) => `${title} · ${done}/${total}`,
    pathLabel: (done: number, today: number, total: number) => `Haazri path: ${done} of ${total} days done, today is day ${today}`,
    empty: 'No giveaways are running right now. Check back tomorrow.',
  },

  haazriDone: {
    title: 'Haazri marked',
    body: (day: number, total: number) =>
      day >= total ? '' : `Day ${day} is done. Come back tomorrow\nfor day ${day + 1} and keep going.`,
    qualifiedTitle: "You're in the draw!",
    qualifiedBody: (prize: string) => `You finished every day. Your free entry in the ${prize} draw is confirmed.`,
    seeGiveaways: 'See more giveaways',
    shareMessage: (appName: string) => `I just did my daily haazri on ${appName}. Free giveaways every day, no fees ever. Join me!`,
  },

  giveaways: {
    title: 'Giveaways',
    subtitle: 'Everything running now. All free to enter.',
    liveCount: (n: number) => `${n} live`,
    all: 'All',
    megaSubtitle: (days: number, last: string) => `Free entry after ${days} ${plural(days, 'day', 'days')} of haazri. Last date ${last}.`,
    continueHaazri: 'Continue haazri',
    runningNow: 'Running now',
    doneTodayCount: (done: number, total: number) => `Done today: ${done} of ${total}`,
    meta: (winners: number, last: string) => `${winners} ${plural(winners, 'winner', 'winners')} · Last date ${last}`,
    empty: 'Nothing running in this category right now. Check back tomorrow.',
  },

  detail: {
    howToEnter: 'How to enter',
    stepDays: (n: number) => (n === 1 ? 'Do one task today' : `Do haazri for ${n} days`),
    stepDaysBody: 'One short task a day: share, visit our website or watch an ad',
    stepToday: (task: string) => `Today: ${task}`,
    stepTodayDone: 'Today’s task is done',
    stepTodayBody: (day: number, total: number) => `Day ${day} of ${total}`,
    stepResult: 'Random draw',
    stepResultBody: (date: string | null) => (date ? `Result on ${date}. Winners are shown in the app.` : 'Winners are shown in the app.'),
    progress: (done: number, total: number) => `Your haazri: ${done} of ${total} ${plural(total, 'day', 'days')}`,
    lastDate: (date: string) => `Last date: ${date}`,
    freeBanner: '100% free. You never pay to enter.',
    rules: 'Rules',
    free: 'FREE',
    doneToday: 'Done for today',
    inDraw: "You're in the draw",
    closed: 'This giveaway has ended',
    pastWinners: 'Winners',
    shareMessage: (title: string, appName: string) => `Win ${title} free on ${appName}. No fees, ever.`,
    rulesTitle: 'Rules',
  },

  winners: {
    title: 'Winners',
    allVerified: 'All verified',
    ranges: { yesterday: 'Yesterday', week: 'This week', mega: 'Mega draw' },
    wonPrefix: 'won ',
    yesterdayWinners: 'Yesterday’s winners',
    weekWinners: 'This week’s winners',
    megaWinners: 'Mega draw winners',
    total: (n: number) => `${n} ${plural(n, 'winner', 'winners')}`,
    empty: 'No winners to show here yet.',
  },

  profile: {
    title: 'Profile',
    totalWinnings: 'Total winnings',
    myWins: 'My wins',
    noWins: 'No wins yet. Keep doing your daily haazri!',
    details: 'Your details',
    name: 'Name',
    phone: 'Mobile number',
    city: 'City or town',
    state: 'State',
    pincode: 'Pincode',
    save: 'Save details',
    saved: 'Saved',
    reminder: 'Daily reminder',
    reminderBody: 'We’ll remind you to do your haazri every day.',
    reminderTime: 'Time',
    reminderDenied: 'Notifications are turned off for Gift Wala. Turn them on in your phone settings.',
    help: 'Help and info',
    logout: 'Log out',
    logoutConfirm: 'Log out of Gift Wala?',
  },

  reminder: {
    channelName: 'Daily haazri reminder',
    title: 'Time for your daily haazri',
    body: 'Do today’s task to stay on track for your prize. It takes one minute.',
  },

  trust: {
    adsPayForPrizes: 'Prizes are paid for by ads. Entry is always free.',
  },

  info: {
    rules: {
      title: 'Rules',
      body: [
        'Entry is always free. We never ask for money, fees or delivery charges.',
        'Each giveaway needs a set number of haazri days. Do one short task each day for that giveaway.',
        'Finish all the days on or before the last date to get a free entry in the draw. A missed day is not lost, it just doesn’t count.',
        'Winners are picked by a random computer draw from everyone who finished all the days.',
        'Our team contacts winners directly on their registered mobile number.',
        'One account per person. Fake accounts or cheating will get an account blocked.',
      ],
    },
    funding: {
      title: 'How we pay for prizes',
      body: [
        'Gift Wala is free for you. The prizes are paid for by the ads you see in the app and on our pages.',
        'The more people use Gift Wala every day, the more we earn from ads, and the bigger the prizes we can give away.',
      ],
    },
    safety: {
      title: 'Stay safe from fraud',
      body: [
        'Gift Wala will never ask you to pay anything to enter or to receive a prize.',
        'We will never ask for your OTP, UPI PIN, bank password or card number.',
        'If someone asks you for money in Gift Wala’s name, it is a scam. Do not pay.',
        'Real winners are only shown in this app and on our official WhatsApp channel.',
      ],
    },
    help: {
      title: 'Help',
      body: [
        'How do I win? Open a giveaway, do its task every day until you finish all the days, and you are in the random draw.',
        'I missed a day. Did I lose? No. Your completed days are kept. Just continue tomorrow, as long as you can still finish before the last date.',
        'How will I know if I won? Winners are shown on the Winners screen, and our team contacts winners on their registered mobile number.',
        'For news and results, join our WhatsApp channel.',
      ],
    },
    openChannel: 'Join WhatsApp channel',
  },

  dates: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    am: 'AM',
    pm: 'PM',
    today: 'Today',
    yesterday: 'Yesterday',
  },
} as const;

export type Strings = typeof en;
