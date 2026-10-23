# Gift Wala — Backend, admin panel and dynamic content

The app is a display shell. Every giveaway, haazri plan, winner, category and setting comes
from the Gift Wala server, which is managed through an admin panel. Nothing is shared with the
website: the app has its own server and MySQL database.

## Stack

- `server/` in this repo: one Next.js project that serves the app API (`/api/v1/...`) and the
  admin panel (`/admin`).
- MySQL 8+/9 via Drizzle ORM. Production runs on the CloudPanel VPS.
- Uploaded images are resized to 600×600 WebP on upload and served from the same server.
- Local development uses a separate MySQL instance on port 3307 with its data in
  `server/.dev-mysql/` (git-ignored), so it never touches other databases on the machine.

## How giveaways and haazri work

- Everyone can take part in every running giveaway. There is no separate join step and no
  one-time entry: every giveaway is entered only through haazri.
- Each giveaway has its own `haazri_days` (1 for a daily recharge, 8, 10, anything).
- Each giveaway has its own day plan: one task per day number. "Day 4" is the user's 4th
  completed day for that giveaway, so late starters still begin at Day 1.
- One haazri per giveaway per day. "Today" is decided by the server in Asia/Kolkata time.
- A missed day never wipes progress and there are no skips: a missed day just does not count.
  A user needs `haazri_days` completed days on or before the giveaway's last date.
- If the days left until the last date are fewer than the days the user still needs, the app
  says so up front instead of letting them start.
- The app shows "Last date: 8 Nov" (the giveaway's last date). There is no "open till 11:59 PM".

### Task types

| Task | Admin sets | Counted when |
|---|---|---|
| Website link | URL, minimum seconds | The user returns to the app at least that many seconds after the server started the task (timed on the server) |
| Share with friends | Number of shares (5 or any), share message | The share screen has been opened that many times |
| Watch reward ad | — | The ad network confirms the ad was watched (AdMob server-side verification). Needs the AdMob build, see "Later" |

Share and website tasks are trust-based and can be cheated; only the ad task is verified.

## Wallet

The Home wallet shows the total ₹ value of everything the user has won: the sum of
`prize_value` over published winners linked to that user.

## Draws and winners

- Admin presses "Pick random winners" on a giveaway. The server picks `winners_count` users at
  random from those who completed every day (not blocked, not already a winner of it) and saves
  the draw (time, number eligible, who was picked) as a record that it was random.
- Picked winners start unpublished. Admin adds photo / video, then publishes.
- Admin can also add a winner by hand and link them to a user by phone (so their wallet updates).
- Hiding a winner removes them from every screen but keeps the record. Delete is for mistakes.
- Winners never show a phone number, masked or not.
- Admin contacts winners directly for now. A winner screen / notification in the app comes later.

## Data model

| Table | Fields |
|---|---|
| `categories` | id, name, sort_order |
| `giveaways` | id, title, subtitle, image_url, tile_color_from, tile_color_to, category_id, tag_text, tag_style (daily / weekly / festival), winners_count, prize_value (₹), haazri_days, starts_at, last_date, result_at, is_featured, sort_order, status (draft / live / ended / results_out), rules_text, timestamps |
| `giveaway_days` | id, giveaway_id, day_number, task_type (website / share / ad), website_url, min_seconds, share_count, share_message — unique (giveaway_id, day_number) |
| `users` | id, phone (unique), name, city, state, pincode, reminder_enabled, reminder_time, is_blocked, created_at, last_seen_at |
| `sessions` | token, user_id, created_at, last_used_at |
| `progress` | user_id, giveaway_id, days_completed, last_done_on, completed_at — primary key (user_id, giveaway_id) |
| `haazri_attempts` | id, user_id, giveaway_id, day_number, task_type, day_date, started_at, verified_at, completed_at, shares_opened, seconds_spent — one completed attempt per user, giveaway and day_date |
| `winners` | id, giveaway_id, user_id (optional), display_name, town, photo_url, prize_label, prize_value, won_at, video_url, draw_id, is_published, is_spotlight, is_pinned_home, sort_order |
| `draws` | id, giveaway_id, run_at, eligible_count, picked_user_ids |
| `settings` | key, value — whatsapp_channel_url, min_app_version, section switches |

A giveaway is visible in the app when `status = live` and today is between `starts_at` and
`last_date`. The giveaway with `is_featured` takes the Home "Mega Draw" poster.

## App API (`/api/v1`)

All calls except login and config send `Authorization: Bearer <token>`.

| Call | Does |
|---|---|
| `POST /auth/login` `{ phone }` | Logs in (creates the user if new). No OTP yet. Returns token + user |
| `GET /me` · `PATCH /me` | Profile: name, city, state, pincode, reminder on/off and time |
| `GET /config` | WhatsApp link, minimum app version, section switches, categories |
| `GET /home` | Featured giveaway + the user's progress in it, running giveaways, ticker winners, pinned winners, Winners-screen spotlight, yesterday's winner count, wallet |
| `GET /giveaways?category=` | Running giveaways with the user's progress and whether today is done |
| `GET /giveaways/:id` | Detail, today's task, progress, whether the user can still finish |
| `POST /giveaways/:id/haazri/start` | Starts today's task, returns it and an attempt id |
| `POST /giveaways/:id/haazri/complete` `{ attemptId, sharesOpened? }` | Checks the task rule and counts the day |
| `GET /haazri` | Every running giveaway with the user's progress (for the Haazri tab) |
| `GET /winners?range=yesterday\|week\|mega` | Spotlight, list, total |
| `GET /me/wins` | The user's wins and wallet total |

## Admin panel (`/admin`)

Single admin, password from the server's environment.

- **Giveaways:** list, create, edit, delete; Mega Draw switch; status; day plan editor (task per
  day, with "same task every day"); image upload.
- **Categories:** add, rename, reorder, delete (blocked while giveaways still use it).
- **Winners:** pick random winners per giveaway, add by hand, link to a user by phone, photo,
  video, publish / hide, spotlight, pin on Home.
- **Users:** search by phone, progress, wins, block.
- **Settings:** WhatsApp channel link, minimum app version, section switches (Mega poster, ticker,
  today's giveaways, Lucky winners, WhatsApp card).

## Stays in the app (not managed)

Info pages (rules, how prizes are paid for, staying safe, help), layout, colours, labels.
No banners and no support contact.

## In the app

- Login: phone number only (no OTP yet). Anyone who types a number can use that account, so add
  OTP before a public launch.
- Profile: name, phone, city, state, pincode; daily reminder on/off and time.
- Reminders are local notifications scheduled on the phone at the user's chosen time.

## Later

- Reward ads: Google AdMob (needs an AdMob account, app id and ad unit id). AdMob is a native
  module, so testing moves from Expo Go to a development build.
- OTP login.
- Winner screen and winner push notifications.
- Hindi content.
