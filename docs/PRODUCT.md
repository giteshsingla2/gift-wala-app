# Gift Wala — Product Brief

Gift Wala is a free giveaway app for people in India. Users enter giveaways for
prizes (iPhones, earbuds, smartwatches, mobile recharges). Entry is always free.
Winners are picked by a random draw and shown publicly with photo and, when
available, a video of them receiving the prize.

## Why the app exists

Today, Facebook/Instagram giveaway posts send people to the website, where they
enter once and rarely return. The app turns those one-time visitors into daily
users. Daily users drive ad revenue, which pays for more and bigger prizes.

## How users arrive

1. See a giveaway post on Facebook/Instagram.
2. Land on the website, register, enter a giveaway.
3. The entry-confirmed page asks them to download the app.
4. They install the app and log in with their phone number.
5. They come back daily through the app to do haazri.

The website is usually the first step, but the app has its own server and
database (nothing is shared with the website). See `docs/BACKEND.md`.

## Giveaway types

| Type   | Prizes                                        | Draw                 |
| ------ | --------------------------------------------- | -------------------- |
| Daily  | Rs 10 / 20 / 49 / 199 recharges, many winners | Same evening         |
| Weekly | Earbuds, smartwatches, speakers               | Once a week          |
| Mega   | iPhone, bike — often festival-themed          | Usually once a month |

- Every giveaway is entered through **haazri**: complete one task per day for
  the giveaway's number of days (1 for a daily recharge, 8, 10...). Finishing
  every day puts the user in the draw. One prize per giveaway, at the end.
- Each day's task is set by the admin: open a website link, share with N
  friends, or watch a reward ad.
- Missing a day never resets progress; it only means fewer days counted.
  There are no skips.

## Entry flow

Open app → browse running giveaways → open one (prize, last date, progress,
past winners) → do today's task → back in the app, the day is counted and the
progress updates. After the last day the user is in the draw.

## What the app shows

- **Home:** biggest current giveaway as a large poster, winner videos, today's
  giveaways, this week's giveaways, upcoming ones.
- **Giveaway details:** prize photos, draw date, how to win, user's progress,
  past winners.
- **Winners:** photo, first name, city, prize, delivery videos. Never phone numbers.
- **Profile:** name, phone, city, state, pincode, total winnings, daily
  reminder time.
- **Winners are contacted by the team directly** for now; an in-app winner
  screen comes later.
- **Info pages (built into the app):** rules, how prizes are funded, staying
  safe from fraud, help.

## Audience

Young people in small cities, towns and villages across India, often on budget
Android phones and slow internet, many not confident with English or complex
apps. It must be understandable without instructions.

- Simple English first; Hindi later (keep all UI strings translatable).
- Android is the primary platform. Keep bundle size, images and network use lean.

## Look and feel

Professional, modern, trustworthy — like a big shopping or payments app.
Prizes always use real product photos and big poster-style banners, never icons.
Not festive, traditional or cluttered.

## Non-negotiables

- Entry is 100% free, always. Never ask for money, fees or delivery charges.
- Prizes are funded by ads, and we say so openly.
- Every winner shown is real. No fake winners, fake popups or made-up numbers.
- Draws are random and shown live.
- Winners get their prize, and we show the delivery.
