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
- All data comes through `src/api/index.ts`. It currently answers from `src/api/mock-data.ts`, which holds
  placeholder people and prizes from the mockups. Replace it with the real API before release: only real,
  verified winners may ever be shown, and winners' phone numbers are never shown (not even masked).
- Fonts: Baloo 2 ships as a variable font, which Android can't weight-select, so `assets/fonts/Baloo2-*.ttf`
  are static instances cut from it. Pick weight by `fontFamily` (`fonts.*` in theme), not `fontWeight`.
- SVG gradient ids must be unique per instance (`useSvgId` / `SvgScope` in `src/components/ui/art.tsx`);
  on web, ids are page-global and stacked screens otherwise steal each other's gradients.
- Prize pictures: `PrizeImage` shows the server `imageUrl` when present, otherwise a placeholder drawing.
