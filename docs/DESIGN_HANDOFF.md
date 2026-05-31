# Handoff: The Cellar Files — Character Bible & Operations Map

## Overview
A premium, content-driven **character bible** for *The Cellar Files*, a mobile wine-mystery game (Carmen Sandiego × Indiana Jones × Interpol dossier). It presents the game's cast — W.I.N.E. agents and "The Decanted" wine criminals — as active targets in an ongoing international investigation. Two views:

1. **Dossiers** — a single, swipeable character sheet at a time (full dossier or "WANTED" stub).
2. **Operations Map** — a world map of "Active Pursuits": every suspect pinned to a last-known wine region, with hover-revealed pursuit routes.

Everything is **data-driven**: characters live in `data.js`, regions in `regions.js`. Adding/promoting a character is a data edit — no view code changes. This mirrors the game's core requirement that non-technical creators add content via JSON.

## About the Design Files
The files in this bundle are **design references created in HTML/CSS/vanilla JS** — a working prototype showing the intended look, motion, and behavior. They are **not** meant to be shipped as-is. The task is to **recreate these designs in the target codebase's environment** using its established patterns and libraries.

The brief specifies a **Next.js 15 + TypeScript + Tailwind + shadcn/ui + Framer Motion** stack. Recreate the prototype there:
- Port the design tokens below into `tailwind.config` / CSS variables.
- Rebuild each sheet as React components (`<DossierSheet>`, `<StubSheet>`, `<OperationsMap>`, `<CharacterRail>`, `<ImageSlot>`).
- Keep the data layer as JSON/TS modules (`characters.ts`, `regions.ts`) so content stays code-free.
- Use Framer Motion for the page-turn, ping, and route-reveal transitions.

The custom drag-drop image store (`slots.js`) is a prototype convenience for staging not-yet-existing character art; in production replace it with your real asset pipeline (CMS/`next/image`), keeping the same slot taxonomy (front photo, expressions ×N, poses ×3).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, motion, and interactions are all specified. Recreate pixel-accurately using the codebase's libraries. The only placeholders are the **character illustrations themselves** — every image area is a labeled slot (front/file photo, expression thumbnails, idle/walking/victory poses, optional world map) to be filled with real renders.

---

## Screens / Views

### 1. Full Dossier Sheet (`buildFull` in `app.js`)
Used for fully-specced characters (`full: true`): Cork Connoisseur, Malbec Mike, Lady Champagne.

**Layout** (centered page, `max-width: 960px`, parchment card with 8px accent "spine" on the left edge, `border-radius: 7px`, paper-grain texture + inset vignette). Internal padding `30px 36px 30px 40px`. Vertical sections, each separated by a `1.5px` rule in `--rule`:

- **Header** — CSS grid `auto 1fr auto`, gap `22px`:
  - *Seal column*: 78×78 circular SVG stamp (grape cluster + curved text "W·I·N·E" / "EST·GLOBAL" for agents, "THE DECANTED" / "MOST WANTED" for villains) + mono label.
  - *Title block*: kicker (`THE CELLAR FILES — FIELD FILE Nº 00X`), two-line name (condensed display, `clamp(40px,7.4vw,76px)`, line 1 in `--accent`, line 2 in `--ink`), an **alias ribbon** (angled banner, parallelogram clip-path), an italic role line, and a **case-file callout bar** (mono segments separated by diamond ticks; a "live" segment has a pulsing dot, e.g. `Active Pursuit`).
  - *Photo column*: 148×178 **passport photo frame** (2px oak border, inset 5px cream mat, corner ticks) holding the featured-expression image slot, with a rotated rubber **status stamp** (`AGENT` green / `WANTED` red) overhanging the top-right corner, and a mono caption naming the current expression.
- **Main** — grid `minmax(0,300px) 1fr`, gap `30px`:
  - *Hero column*: tall (`aspect-ratio 3/4`) full-body pose image slot standing on a radial ground-shadow, with 1–2 rotated **evidence stamps** overlaid (`ON DUTY` / `WANTED` / `ARMED` / `PRIORITY`). Below: a pill **pose selector** (`IDLE · WALKING · VICTORY`).
  - *Info column*: drop-cap **bio** paragraph; a **stats** list (diamond bullet + mono key + value; the motto value is italic burgundy); a **signature-accessory** callout box (left accent border, mono label, condensed name, description).
- **Field Intelligence** (Interpol dossier) — section heading + `dossier-grid` (3 columns, hairline dividers). First cell is the **threat meter**: mono label + 5 pip dots (filled = level) + a word (`HIGH`/`EXTREME`/`LEVEL V`…), all tinted by threat color. Remaining cells: Last Known Location, Home Wine Region, Favorite Wine, Case Status, and **Bounty** (gold, condensed, e.g. `◆ 1,200,000₣`).
- **Known Crimes / Service Record** (rap sheet) — heading + list; each row = a small rotated **evidence tag** (`EXHIBIT A/B/C`, red; or `CLOSED`, green for the agent) + the crime text.
- **Travel History** (passport markings) — heading + a row of overlapping, rotated **circular ink stamps** (region name on the top arc + "· SIGHTED", a roman-numeral year in the center, "ENTRY" + "W.I.N.E." sub-text), each in a varied sepia/wine ink, `~102px`.
- **Expressions** — heading + a strip of circular thumbnail slots (74px) with mono labels; the active one has an accent ring.
- **Poses** — heading + idle/walking/victory rectangular slots (104×138) with labels; the active one has an accent outline.
- **Color Palette** — heading + a row of swatches (each shows name + hex on a translucent overlay; tap to copy).
- **Footer** — file tag + faux **barcode** (CSS repeating-gradient) + file code + a circular gold **monogram** seal.

### 2. Stub Dossier Sheet (`buildStub` in `app.js`)
Used for not-yet-detailed criminals (`full: false`): The Corkfather, Pinot Noir, The Decanter, Rosé Renée, Cabernet Jack. Same header (with `WANTED` stamp + case bar). Then:
- **Stub main** — grid `minmax(0,260px) 1fr`: a single **surveillance photo** slot (`aspect-ratio 4/5`) with two black **redaction bars** and a striped `CLASSIFIED` band; plus a profile column (mono "Profile · Unconfirmed" kicker, lead description, italic appearance line, accent-bordered signature quote).
- Same **Field Intelligence**, **Known Crimes**, **Travel History** blocks as the full sheet.
- A dashed **"DOSSIER STATUS: PENDING"** banner with a pulsing dot, signalling the sheet is promotable to a full dossier purely via data.

### 3. Operations Map (`buildMapSheet` in `map.js`)
Reached via the top **mode toggle** (`◍ Operations Map` / `▤ Dossiers`).
- **Header**: kicker `W.I.N.E. — GLOBAL OPERATIONS · CLASSIFIED`; two-line title `ACTIVE / PURSUITS`; italic sub-line (`N suspects tracked across N wine regions · 1 agent deployed`); a **threat-key legend** (Low/Viral/High/Extreme/Agent dots).
- **Map panel**: `aspect-ratio 2/1`. An inner clipped layer (`overflow:hidden`, rounded) holds: an optional **drop-a-world-map** image slot (equirectangular), a faint **graticule** SVG (meridians/parallels every 30°, dashed equator), a **routes** SVG (one dashed polyline group per character, hidden until hovered), and a **compass** rose (bottom-right). **Pins** are siblings outside the clip (so tooltips can overflow), positioned by equirectangular projection.
- **Pin**: 25px circle, monogram inside, ring + (for villains) an animated **ping** pulse, all tinted by threat color (agent = green, gold-ringed, no ping). Hover/focus → shows a mono label, a **tooltip card** (name, alias, threat/clearance word, last seen, "Open file →"), reveals that character's **pursuit route** (dashed line through their travel regions), and dims other pins. Click → opens that character's dossier.
- **Suspects at Large** grid (2-col): clickable cards (monogram disc, name, alias, last-seen line, threat chip, bounty). Click → opens the dossier.
- Footer with barcode, as above.

### Persistent Chrome
- **Brand bar** (top): title `The Cellar Files` / `W.I.N.E. Field Dossier System` between gold hairlines.
- **Mode bar**: the two pill toggles.
- **Character rail** (fixed bottom): horizontally-scrollable chips (monogram disc + name + role/alias + red dot for WANTED). Active chip is cream-filled. Click → that dossier (or, from map view, opens it directly).
- **Nav arrows** (fixed left/right, dossier view only) + keyboard ← → + touch swipe to move between characters.
- **Toast** (bottom center) for "Copied #HEX".

---

## Interactions & Behavior
- **Mode toggle**: switches `#stage` between the dossier renderer and the map renderer; adds `body.map-view` (hides nav arrows); updates the active pill.
- **Character navigation**: `goTo(i, dir)` animates the current sheet out (`turn-out`), swaps content, animates the new one in (`turn-in`). Triggered by arrows, ←/→ keys, swipe (`dx > 60px` and mostly-horizontal), or rail chips.
- **Page-turn animation**: `turnOut` (0.26s ease-in → `rotateY(-14deg) translateX(-30px)`, fade) then `turnIn` (0.34s ease-out from `rotateY(16deg) translateX(40px)`). **Important robustness note**: the resting sheet state must be fully visible; the turn-in class is removed on `animationend` **and** via a 500ms timeout fallback (CSS animations throttle in background tabs and can otherwise trap a sheet at `opacity:0`). Replicate this safety in Framer Motion by ensuring the settled state is the visible one.
- **Expression swap**: tapping an expression thumbnail (or its label) sets it as the featured passport photo and updates the active ring + caption. The featured frame and the thumbnail share one image source, so they mirror.
- **Pose swap**: tapping a pose label/selector swaps the big hero image and syncs the pose selector + gallery active states.
- **Copy hex**: tapping a palette swatch copies the hex (`navigator.clipboard`, with `execCommand` fallback), flashes a "Copied" overlay, and shows the toast (~1.4s).
- **Map pin**: `mouseenter`/`focus` → `activate(id)` (adds `.on` to that route group, `.active` to the pin, `.focused` to the map to dim others); `mouseleave`/`blur` → `deactivate()`. Click → `api.goToChar(index)` switches to the dossier.
- **Pulse/ping** animations: status "live" dot and pin ping loop continuously.

## State Management
Minimal, all view-local:
- `idx` — current character index.
- `view` — `"dossier"` | `"map"`.
- `sel[charId] = { expr, pose }` — per-character selected expression & pose indices (defaults 0/0).
- Image slots — prototype stores data URLs in `localStorage` under `cellarfiles:slot:<id>` and re-renders all elements bound to an id (enables mirroring). **In production, replace with your asset system**; keep the slot id taxonomy: `"<charId>__expr__<key>"`, `"<charId>__pose__<key>"`, `"<charId>__photo"` (stub), `"world-map"`.

No data fetching in the prototype. In production, characters/regions can come from JSON files, a CMS, or (per the brief's roadmap) Supabase/Postgres — the component contracts below don't change.

## Data Model
**Character** (`data.js`): `id`, `full`, `faction` (`"wine"` | `"decanted"`), `status` (`"AGENT"` | `"WANTED"`), `fileNo`, `name` (`[line1, line2]`), `alias`, `role`, `accent`/`accent2`/`accentSoft` (hex), `monogram`, `mapKey` (region key), `bio`, `caseTag` (`[{t, live?, reward?}]`), `evidence` (`[string]`, ≤2), `threat` (`{label, level 0–5, word, color}`), `dossier` (`[{k, v, reward?}]`), `crimes` (`{title, hint, tag, closed?, items[]}`), `travel` (`[{name, date}]`), `stats` (`[{k, v, motto?}]`), `accessory` (`{name, desc}`), `expressions` (`[{key, label}]`), `poses` (`[{key, label}]`), `palette` (`[{name, hex}]`). Stub characters add `knownFor`, `appearance`, `signature` and omit expressions/poses/palette/stats/accessory.

**Region** (`regions.js`): `KEY → {lat, lon, country}`. Pins/routes project with `x% = (lon+180)/360`, `y% = (90−lat)/180`; the SVG layers use a `0 0 360 180` viewBox (`x = lon+180`, `y = 90−lat`) with `preserveAspectRatio="none"` and `vector-effect="non-scaling-stroke"`.

---

## Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| `--burgundy` | `#6E2230` | primary / Cork accent |
| `--burgundy-deep` | `#5A1A26` | accent shade |
| `--cabernet` | `#8B2638` | evidence/red ink |
| `--paper` | `#F3E8CF` | sheet base |
| `--paper-2` | `#ECDEBE` | slot/cell fill |
| `--paper-edge` | `#E2D0A8` | — |
| `--cream` | `#F6EEDA` | light text on dark, mats |
| `--oak` | `#3A2A1C` | dark borders/ink |
| `--ink` | `#2B2117` | body text |
| `--ink-soft` | `#5A4A38` | secondary text |
| `--gold` | `#B8902F` | gold accent |
| `--gold-deep` | `#977322` | mono labels, bounty |
| `--gold-soft` | `#D8BC73` | gold on dark |
| `--vine` | `#5B6B3A` | low threat |
| `--rule` | `rgba(58,42,28,0.28)` | section rules |
| `--rule-soft` | `rgba(58,42,28,0.14)` | hairlines |
| Backdrop | radial `#4a2a26 → #1e0f0d` | desk behind the sheet |

**Per-character accents**: Cork `#6E2230`/`#B8902F`; Malbec `#4E2A5E`/`#C8C6CB`; Lady Champagne `#A6801F`/`#E7D196`; Corkfather `#5A1A26`; Pinot `#3A2730`; Decanter `#4A5A66`; Renée `#B85C7A`; Jack `#7A3B22`. (Full palettes per character in `data.js`.)

**Threat colors**: Low `#5B6B3A` · Viral `#B8902F` · High `#C8742E` · Extreme `#9c2b32` · Agent/clearance `#3f6b3f`. Stamp colors: agent `#3f6b3f`, wanted `#9c2b32`.

### Typography (Google Fonts)
- **Oswald** (400/500/600/700) — `--font-display`. Condensed travel-poster headers, names, ribbons, buttons. Uppercase; names `line-height .86`, slight negative tracking.
- **Spectral** (400/500 + italics) — `--font-body`. Bio, values, mottos (italic), role lines.
- **Space Mono** (400/700) — `--font-mono`. Kickers, stat keys, captions, legend, barcodes, case bar. Uppercase, wide letter-spacing (`.1–.32em`).

Representative sizes: name `clamp(40px,7.4vw,76px)`; section headings `14px/700` uppercase tracked `.2em`; mono labels `9–10.5px` tracked `.2em`; bio `16.5px/1.62`; stat value `15.5px`; dossier value `15px`; tooltip name `15px`.

### Spacing / Radius / Shadow / Motion
- Sheet padding `30px 36px 30px 40px` (mobile `24px 20px`); section top margin `28px`, top padding `20px`. Grid gaps `22–30px`.
- Radii: sheet `7px`; cards/cells/slots `3–6px`; pills/chips/pins `50%–999px`.
- Shadows: sheet `0 40px 90px -30px rgba(20,10,6,.75), 0 8px 24px -12px rgba(20,10,6,.5)`; tooltip `0 14px 30px -12px rgba(20,10,6,.7)`.
- Motion: page turn 0.26s in / 0.34s out; hover/route 0.15–0.22s; ping 2.8s loop; live-dot pulse 1.6s.

### Breakpoints
`820px` (header → 2-col, main → 1-col, hide arrows), `760px` (dossier grid → 2-col), `680px` (suspect grid → 1-col), `520/480px` (hide seal column, single-column dossier grid, smaller pose slots).

## Assets
- **Fonts**: Oswald, Spectral, Space Mono (Google Fonts).
- **Character art**: NONE included — every illustration is an empty labeled slot for the team to fill (front/file photo, expressions, idle/walking/victory poses; stub surveillance photo; optional equirectangular world map). Sizes listed under each screen.
- **Decorative SVG (inline, generated)**: grape-cluster W.I.N.E. seal, circular passport travel stamps, compass rose, map graticule, route polylines. No external image files.
- **Other graphics**: barcodes, redaction bars, evidence/status stamps, threat pips are pure CSS.

## Files
All under `design_handoff_cellar_files/`:
- `The Cellar Files - Character Bible.html` — shell: fonts, brand bar, mode bar, `#stage`, rail, nav, toast; loads scripts in order.
- `styles.css` — all styling and tokens (`:root`), V2 investigation layer, V3 operations-map layer, responsive rules.
- `data.js` — `window.CHARACTERS` (3 full + 5 stub). The content source of truth.
- `regions.js` — `window.REGIONS` lat/lon table.
- `slots.js` — prototype drag-drop image-slot store (replace in production).
- `map.js` — `window.buildMapSheet(api)` operations map.
- `app.js` — dossier renderers, view switching, navigation, interactions.

> Load order matters: `data.js → regions.js → slots.js → map.js → app.js`.

---

## Bonus Module: Case File (Gameplay Vertical Slice)
A second deliverable — `The Cellar Files - Case File.html` — is a **playable single-case chase loop** (Carmen Sandiego–style), proving how the bible's cast + data power actual gameplay. It is **mobile-first** (a centered phone frame on the dark desk) and reuses the same palette, type, `Slots` art system, `data.js` cast, and `regions.js` geo-table. The two link to each other (the bible's mode bar → "▶ Play a Case"; the briefing → "‹ Character Bible").

### The Loop (state machine in `case.js`)
`briefing → investigate → travel → tracker → result`, with `reset()` for replay.
1. **Briefing** — the Chief (Cork Connoisseur) reports a theft: stolen bottle (art slot), crime location, recovery bounty, and a flavorful brief. "Accept the Case" starts the chase.
2. **Investigate** — each stop shows a location header (name, place, country) + a live **minimap** pin, a sticky **HUD** (case title + **Trail Heat** meter + filed-warrant chip), and a list of tappable **Leads**. One lead reveals a **trait clue** (logged into the Tracker), one reveals a **destination clue** (unlocks travel); others are flavor. A bottom action bar exposes **Suspect Tracker** and **Follow the Trail** (gated until the destination clue is found).
3. **Travel** — the destination clue + 3 region options (mini-maps). Correct choice plays a **fly-over** transition and advances to the next stop; a wrong choice costs 25 Trail Heat (0 → "Trail Went Cold" loss).
4. **Suspect Tracker** — the 7 Decanted as mugshots (bound to the same `firstExpr` art slot as the bible, so dropped art appears here too). Logged traits show as chips; any suspect contradicting a known trait is **CLEARED** (greyed + stamp). When one remains it's flagged **PRIME SUSPECT**. Tapping a suspect opens a warrant **confirm** dialog (warns if you're filing against a cleared suspect).
5. **Capture / Result** — at the final stop, **Make the Arrest** is gated on a filed warrant. Right warrant → **CASE CLOSED** win (portrait, narrative, bounty, confetti); wrong warrant → "Wrong Suspect"; ran out of heat → "Trail Went Cold". Replay resets the case.

### Gameplay Data (`case-data.js`)
- **`window.TRAITS`** — the deduction matrix. Three categories (`wineTrail`, `method`, `card`), each with a `label`, `options`, and a `values` map giving every suspect one value. Logging the culprit's value clears anyone who doesn't share it. Tune difficulty by overlapping values (more overlap = more clues needed to narrow to one).
- **`window.CASES`** — authored cases. Each has a `culprit` (suspect id = the answer), `reward`, `bottle`, `scene`, `brief`, and `legs[]`. **The chase follows the culprit's trail**: each leg = a stop with `leads[]` (one carries a trait `clue`, one carries `dest:true`) and a `dest` object (`clue` text, `correct` region key, 3 `options`). Add a new case by appending an object — no engine changes.

### Production notes (same as above)
Recreate in the target stack: the loop is a small finite-state machine (`view`, `leg`, `trail`, `known{}`, `warrant`, `leadsDone{}`) — port to a reducer/store (e.g. Zustand/XState). Cases/traits become typed JSON. The fly-over and slide-up reveal are CSS keyframes — rebuild with Framer Motion (keep the settled state visible-by-default, as noted in the animation safety note above). Replace `Slots` with the real asset pipeline; the Tracker/briefing/result mugshots reuse the bible's slot ids for continuity.

### Files (gameplay)
- `The Cellar Files - Case File.html` — phone-frame shell; loads `data.js → regions.js → slots.js → case-data.js → case.js`.
- `case.css` — mobile-first game UI (phone frame, HUD, leads, tracker, travel, result).
- `case-data.js` — `TRAITS` matrix + `CASES` (one authored case, "The Vanishing Cuvée").
- `case.js` — the state machine + all screen renderers.
