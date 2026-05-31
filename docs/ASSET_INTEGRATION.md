# Asset Integration & Commit Guide

The W.I.N.E. character art is now **physically committed** in this handoff so the app
stops depending on browser-local (drag-drop / localStorage) images.

## Where the files live
```
public/assets/
  characters/<slug>/expressions/<slug>-expr-<key>.png   (420×420 PNG)
  characters/<slug>/poses/<slug>-pose-<key>.png         (560×770 PNG, transparent)
  maps/world-map.png                                    (2048×1024 PNG)
```
8 characters · 39 expression heads · 24 pose figures · 1 map = **64 PNGs (~17 MB)**.

## Path convention (important)
- On disk: `public/assets/characters/...`
- In code (`src/data/characterAssets.ts`): `/assets/characters/...` (leading slash, **no** `/public`).
  Next.js serves everything in `/public` from the site root, so `/public/assets/x.png` → `/assets/x.png`.
- The prototype HTML files in this bundle reference `assets/...` (relative) and read the same tree
  from the main design project; in the Next.js app, use the `/assets/...` paths from the manifest.

## Using the manifest
```ts
import { characterAssets } from "@/data/characterAssets";
const cork = characterAssets.find(c => c.id === "cork");
<img src={cork.expressions[0].src} alt={cork.displayName} />   // /assets/characters/cork/expressions/cork-expr-confident.png
```
Every `src` points to a real committed file — **no broken paths**. Render a placeholder
(primaryColor bg + monogram + "Asset Pending") only if you add NEW keys before their PNG exists.

## Replacement workflow (one-by-one, after commit)
1. Open `docs/asset-quality-report.md` — find the ⚠️ "needs replacement" rows.
2. Drop a better PNG at the **exact same path** (same filename). No code change.
3. Target specs: expression heads square ≥500×500 (cream bg OK, no labels); pose figures
   transparent ≥800×1100, full body, no labels/stamps; map 2048×1024 equirectangular.
4. Re-commit just that file.

## Commit
```bash
git add public/assets src/data/characterAssets.ts docs/asset-quality-report.md docs/ASSET_INTEGRATION.md
git commit -m "Add committed W.I.N.E. character art + manifest (imperfect; see asset-quality-report)"
git push
```

## Still to create
- `public/assets/props/stolen-bottle.png` (600×900 transparent) — case-briefing bottle prop, not yet made.
