# The Cellar Files

A mobile-first wine-mystery game — *Carmen Sandiego × Indiana Jones × Interpol dossier*.
Play as a W.I.N.E. agent: study the cast in the Character Bible, track suspects on the
Operations Map, and chase down "The Decanted" in a playable case loop.

This repository is the **static, deployable build** of the prototype — pure HTML/CSS/vanilla
JS with no build step. It runs as-is on any static host (GitHub Pages, Netlify, etc.).

## Screens
- **`index.html`** — W.I.N.E. Headquarters (the hub: agent profile, current assignment, departments).
- **`character-bible.html`** — Dossiers (swipeable character sheets) + Operations Map (`#map`).
- **`case-file.html`** — The playable case: *The Vanishing Cuvée* (briefing → investigate → travel → tracker → arrest).
- **`passport.html`** — Agent passport / travel stamps.

## Run locally
No dependencies or build needed — just serve the folder over HTTP (needed so the
browser can fetch the scripts and art):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening the files via `file://` will not work (scripts and image probes need HTTP).

## Deploy to GitHub Pages
A workflow is included at `.github/workflows/deploy.yml`.

1. Push this folder to a GitHub repo (default branch `main`).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` builds and publishes the site. The live URL appears in the
   Actions run summary and under Settings → Pages.

Prefer the simple route instead? **Settings → Pages → Deploy from a branch → `main` / `(root)`**
also works — the `.nojekyll` file ensures the `assets/` folder is served untouched.

## Project layout
```
index.html, character-bible.html, case-file.html, passport.html   # pages
styles.css, case.css                                              # styling + design tokens
data.js          # CHARACTERS (the content source of truth: 3 agents + 5 stubs)
regions.js       # REGIONS lat/lon table (map projection)
art.js           # art manifest — maps each slot id to its PNG under assets/
slots.js         # image-slot store (auto-loads art from the manifest)
map.js           # Operations Map renderer
app.js           # Dossier renderer, navigation, view switching
case-data.js     # TRAITS deduction matrix + CASES (authored cases)
case.js          # case-loop state machine + screens
career.js, passport-data.js   # HQ / passport progression data
assets/
  characters/<slug>/expressions/*.png   # featured/expression art
  characters/<slug>/poses/*.png         # idle / walking / victory poses
  maps/world-map.png                    # operations-map base
  maps/region-<KEY>.png                 # per-region maps shown in the case loop
  maps/travel-banner.png                # "in transit" banner (travel screen)
  flags/<country>.png                   # country flags (travel options, passport stamps)
  props/stolen-bottle.png               # case prop (placeholder — replace with final art)
docs/            # original design handoff, asset reports, reference TS module
```

## Adding / editing content
The game is **data-driven** — no view code changes needed:
- **New or promoted character** → edit `data.js`.
- **New case** → append an object to `CASES` in `case-data.js`.
- **New character art** → drop PNGs into `assets/characters/<slug>/...` following the
  existing naming (`<slug>-expr-<key>.png`, `<slug>-pose-<key>.png`); `art.js` picks them
  up automatically. Replace `assets/props/stolen-bottle.png` with the final bottle render.

## Notes
- Fonts (Oswald, Spectral, Space Mono) load from Google Fonts at runtime.
- See `docs/DESIGN_HANDOFF.md` for the full design specification, tokens, and the
  intended production stack (Next.js + TypeScript + Tailwind) if you later port it.

## Cleaning character art (backgrounds)
Many character portraits ship with their photo background baked in. Character art is sliced from the sprite sheets in `art-source/sprite-sheets/`
via `python tools/slice_sheets.py`. For background cleanup of other art, see `tools/README.md` — run
`python tools/clean_images.py` locally, or use the **"Clean character art"**
GitHub Action. It auto-skips images that are already clean.
