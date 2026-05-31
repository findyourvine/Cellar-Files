# The Cellar Files — Art Assets

Drop final PNGs here and they load automatically everywhere (dossiers, suspect
cards, case briefing, arrest screen, HQ). No code changes needed — `art.js`
maps each slot to a path below, and `slots.js` probes for the file; if it's
missing, a polished "Asset Pending" placeholder shows instead (never a broken
image icon).

## Folder structure
```
assets/
  characters/
    cork/           expressions/  poses/
    malbec-mike/    expressions/  poses/
    champagne/      expressions/  poses/
    rose-renee/     expressions/  poses/
    cabernet-jack/  expressions/  poses/
    corkfather/     expressions/  poses/
    decanter/       expressions/  poses/
    pinot-noir/     expressions/  poses/
  maps/             world-map.png
  props/            stolen-bottle.png
```

## File names (must match exactly)
**Expression heads** — square 1:1, ≥500×500, face centered, flat cream bg OK:
- `cork/expressions/cork-expr-{confident,amused,thinking,surprised}.png`  *(Cork render shows: confident, thinking, amused, surprised)*
- `malbec-mike/expressions/malbec-mike-expr-{charming,cocky,laughing,focused,winking}.png`
- `champagne/expressions/champagne-expr-{elegant,playful,knowing,curious,mysterious}.png`
- `rose-renee/expressions/rose-renee-expr-{elegant,playful,knowing,curious,mysterious}.png`
- `cabernet-jack/expressions/cabernet-jack-expr-{confident,amused,focused,surprised,determined}.png`
- `corkfather/expressions/corkfather-expr-{confident,amused,arrogant,thinking,threatening}.png`
- `decanter/expressions/decanter-expr-{confident,amused,thinking,focused,intrigued}.png`
- `pinot-noir/expressions/pinot-noir-expr-{winemaker,sommelier,auctioneer,wine-critic,importer}.png`  *(disguises)*

**Pose figures** — portrait 3:4, ≥800×1100, full body, **transparent PNG**:
- `{slug}/poses/{slug}-pose-{idle,walking,victory}.png` for every character
- **Pinot Noir** uses `idle, walking, disappearing` (no victory)

**Shared:**
- `maps/world-map.png` — 2048×1024, flat 2:1 equirectangular, parchment/vintage
- `props/stolen-bottle.png` — 600×900, single bottle, transparent

## Background note (honest)
Expression heads can keep a flat cream/parchment background — the UI masks them
into circles. **Pose figures must be transparent PNGs** — they stand on a soft
shadow in dossiers and as cut-outs in the game. Figures exported with their
scene background baked in (e.g. the Eiffel balcony, ship deck, cellar) will show
that rectangle and break the effect. Export poses on transparency.
