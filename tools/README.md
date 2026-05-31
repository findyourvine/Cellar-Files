# Image cleaning tools

## The problem (diagnosis)

The character art splits into two kinds:

- **Poses** (idle / walking / victory) — already clean cutouts with transparent
  backgrounds. **Good. Leave them alone.**
- **Expressions / portraits** — these are **opaque rectangles with the original
  photo background baked in** (a textured wall behind the person). On the
  parchment dossier and on the map/tracker they show as a hard rectangle with a
  grey background. That's the "looks really bad" problem.

A scan of the 63 character PNGs: **39 have a baked-in background, 24 are already
clean.**

## Why not ImageMagick

Removing a *photographic* background (a wall, a room) requires **semantic
segmentation** — the tool has to understand "this is a person, that is the
background." ImageMagick can only do colour-key / fuzz removal, which keys out a
*colour range*, not an object. On a multi-tone wall that smears and leaves
semi-transparent blobs — exactly the half-removed, "blobby transparency" result
from earlier attempts.

The right tool is **`rembg`** (U²-Net person segmentation). That's what to
install, not ImageMagick.

## What `clean_images.py` does

1. Walks `assets/characters/**/*.png`.
2. **Auto-triages** each image and **only re-cuts the ones that need it**
   (opaque or blobby). Already-clean cutouts are left untouched — re-cutting a
   good image can degrade it (e.g. punch holes between the legs of a pose).
3. Re-cuts with `rembg` (`u2net_human_seg`) + alpha matting, keeps the largest
   foreground blob, feathers the edge, and de-contaminates the 1px rim so no
   background colour fringes the silhouette.
4. Overwrites the PNG in place.

## Run it locally

```bash
pip install -r tools/requirements.txt

python tools/clean_images.py --dry-run     # triage report, writes nothing
python tools/clean_images.py               # clean everything that needs it
python tools/clean_images.py --only cork   # just one character
```

First run downloads the segmentation model (~175 MB) to `~/.u2net/`.

## Run it on GitHub (no local setup)

A workflow is included: **Actions → "Clean character art" → Run workflow.**
It installs the tools, runs the cleaner (auto-skipping clean images), and commits
the cleaned PNGs back. Run it on a branch first if you want to review the diff
before it hits `main`.

## Notes / tuning

- Best model for people is `u2net_human_seg` (the default). `isnet-general-use`
  is an alternative if a particular character segments poorly.
- If a specific portrait still has a soft edge, raise
  `alpha_matting_erode_size` in `recut()`.
- The triage thresholds live in `classify()` — `transp < 1%` ⇒ opaque,
  `stray > 2%` ⇒ blobby. Adjust if you add art with different characteristics.

---

## Re-slicing the character sprite sheets

The clean character art is produced from the per-character sprite sheets in
`art-source/sprite-sheets/` (one sheet per character: a top row of expression
portraits and a bottom row of full-body poses, on solid black).

```bash
pip install pillow numpy scipy
python tools/slice_sheets.py
```

This slices every sheet, knocks out the black background (texture-aware, so dark
clothing on black survives), auto-crops, and writes the transparent PNGs to
`assets/characters/<slug>/{expressions,poses}/` using the exact filenames the
game expects. The cell→filename map lives in `CFG` at the top of the script and
matches `data.js` order, so re-running needs no code changes.

To update a character's art: replace its sheet in `art-source/sprite-sheets/`
(keep the same row/cell layout) and re-run. If you change how many expressions or
poses a character has, update both `CFG` here and that character's `data.js`
entry.

Note: black-background removal is reliable (unlike the photographic-background
case that `clean_images.py` handles). Use `slice_sheets.py` for the black-bg
sheets; use `clean_images.py` only if you ever get art with a non-black
background baked in.
