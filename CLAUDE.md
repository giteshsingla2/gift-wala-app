@AGENTS.md
@docs/PRODUCT.md

## Project layout

Only route files belong in `src/app/`. Everything else lives beside it in `src/`:

- `src/app/` — Expo Router screens and `_layout.tsx` navigators
- `src/components/ui/` — generic building blocks (buttons, cards, poster banners)
- `src/components/giveaway/` — giveaway cards, progress/tier display, entry confirmation
- `src/components/winners/` — winner cards and winner video player
- `src/api/` — backend and website API client
- `src/store/` — app state (session, linked user, entries)
- `src/hooks/` — shared hooks
- `src/lib/` — pure helpers (dates, draw countdowns, formatting rupees)
- `src/types/` — shared types (Giveaway, Prize, Entry, Winner, Tier)
- `src/constants/` — theme tokens (colors, spacing, typography)
- `src/i18n/` — UI strings; English now, Hindi later, so no hard-coded copy in components
- `assets/fonts/` — bundled fonts

## Working notes

- Visual source of truth: the design handoff (DESIGN.md, tokens.json, screens/*.html, screenshots/*.png)
  that came in as `giveaway-app-design-handoff`. Tokens live in `src/constants/theme.ts`.
- Use Node 22+ (`.nvmrc`). Expo SDK 58 does not support Node 20.
- All content is dynamic. The app calls the Gift Wala server through `src/api/` (see `docs/BACKEND.md`);
  the server and admin panel live in `server/` (Next.js 16 + MySQL via Drizzle; read
  `server/node_modules/next/dist/docs/` before changing Next code). Only published winners reach the app,
  and winners' phone numbers are never shown (not even masked).
- Local development:
  - MySQL (separate dev instance, port 3307):
    `mysqld --datadir=server/.dev-mysql/data --port=3307 --socket=server/.dev-mysql/mysql.sock --mysqlx=OFF --bind-address=127.0.0.1`
  - Server: `cd server && npm run dev` (http://localhost:3000, admin at /admin; password in `server/.env.local`).
    `npm run db:migrate` applies migrations, `npm run db:seed` resets the dev database with sample data.
  - Phone over USB: `adb reverse tcp:8081 tcp:8081 && adb reverse tcp:3000 tcp:3000`, then `npx expo start`.
- Expo Go can't run reminders (expo-notifications needs native modules Expo Go lacks on Android) or
  reward ads; `src/lib/reminders.ts` skips itself there. Use a development build to test those.
- Fonts: Baloo 2 ships as a variable font, which Android can't weight-select, so `assets/fonts/Baloo2-*.ttf`
  are static instances cut from it. Pick weight by `fontFamily` (`fonts.*` in theme), not `fontWeight`.
- SVG gradient ids must be unique per instance (`useSvgId` / `SvgScope` in `src/components/ui/art.tsx`);
  on web, ids are page-global and stacked screens otherwise steal each other's gradients.
- Prize pictures: `PrizeImage` shows the server `imageUrl` when present, otherwise a placeholder drawing.
