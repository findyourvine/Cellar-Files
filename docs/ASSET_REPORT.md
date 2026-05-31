# Asset Extraction — TODO / Quality Report

**Status: DONE > PERFECT.** Real character art is now live in-game for all 8 characters
(~63 assets), auto-loaded via `art.js` → `slots.js`. These were extracted programmatically
from the uploaded W.I.N.E. dossier sheets by proportional cropping + edge flood-fill
transparency. They are intentionally imperfect; replace any below with clean exports when ready.

## What was extracted
| Character | Expressions | Poses | Source sheet |
|---|---|---|---|
| Cork Connoisseur | 4 | idle, walking, victory | CC-01 |
| Malbec Mike | 5 | idle, walking, victory | trio sheet (lower-res) |
| Lady Champagne | 5 | idle, walking, victory | LC-02 |
| Rosé Renée | 5 | idle, walking, victory | RR-02 |
| Cabernet Jack | 5 | idle, walking, victory | CJ-07 |
| The Corkfather | 5 | idle, walking, victory | CF-01 |
| The Decanter | 5 | idle, walking, victory | TD-01 |
| Pinot Noir | 5 (disguises) | idle, walking, disappearing | PN-01 |

All under `assets/characters/<slug>/expressions/` and `/poses/`.

## Known imperfections (replace when convenient)
1. **Pose transparency** — figures were cut from the parchment pose-strips via border flood-fill.
   Expect **minor halos** and occasional **small fragments** of the dossier (a stray "PO" label
   corner or paper edge appears top-right on a few poses: Cork, Pinot, Cabernet Jack). Acceptable
   at gameplay scale; re-export on true transparency for pixel-perfect.
2. **Malbec Mike** came from the 3-up trio sheet, so his crops are **lower resolution** than the
   others. Priority for a clean re-render.
3. **Expression heads** keep their original background (parchment or studio) — fine because the UI
   masks them into circles. A couple may sit slightly low/high in frame.
4. **Pinot Noir** expressions are his *disguises* (winemaker/sommelier/etc.) by design; poses include
   a "disappearing" particle pose instead of victory.
5. Crops use **blind proportional coordinates** per sheet — if a future dossier re-render changes
   layout, the crop boxes in the extraction script will need re-measuring.

## How to replace any asset
Drop a PNG at the exact path (see `assets/README.md`), e.g.
`assets/characters/malbec-mike/poses/malbec-mike-pose-idle.png`. It overrides automatically —
no code change. For best results: expression heads square ≥500×500 (cream bg OK); pose figures
transparent PNG, full body, ≥800×1100.

## Map
`assets/maps/world-map.png` (2048×1024 equirectangular parchment chart) was **generated** by canvas
(stylized continents), not extracted. It's live in Active Pursuits with correctly-aligned lat/long
pins. Swap for a hand-illustrated map any time — keep it flat equirectangular so pins stay aligned.
