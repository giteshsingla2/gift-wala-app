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
