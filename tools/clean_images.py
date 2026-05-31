#!/usr/bin/env python3
"""
Clean character art: remove photographic/blobby backgrounds and produce
clean transparent cutouts.

Why this and not ImageMagick:
  The character portraits have real photo backgrounds (a textured wall, etc.).
  Removing that needs *semantic* person segmentation, which ImageMagick cannot
  do. This script uses `rembg` (U^2-Net). ImageMagick only does colour-key /
  fuzz removal, which smears on multi-colour backgrounds (that's what produced
  the earlier "blobby" transparency).

What it does:
  1. Walks the character art under --root (default: assets/characters).
  2. AUTO-TRIAGES each PNG:
        - "clean"  -> already a good cutout (real transparency, no stray
                      background blobs). LEFT UNTOUCHED.
        - "needs"  -> opaque rectangle (baked-in background) OR blobby
                      half-removed background. RE-CUT.
     This is important: re-cutting an already-clean image can *degrade* it,
     so we never touch the good ones.
  3. Re-cuts the "needs" images with rembg + alpha matting, keeps the largest
     foreground blob, feathers the edge slightly, and lightly de-contaminates
     the 1px edge so no background colour fringes the silhouette.
  4. Overwrites the PNG in place (run it on a branch / via the Action so the
     change is reviewable).

Usage:
    python tools/clean_images.py --dry-run            # triage report only
    python tools/clean_images.py                      # clean everything that needs it
    python tools/clean_images.py --only cork          # restrict to one character slug
    python tools/clean_images.py --model u2net_human_seg
"""
import argparse, glob, os, sys
import numpy as np
from PIL import Image

# scipy is only needed for post-processing; import lazily with a clear message.
try:
    from scipy import ndimage
except ImportError:
    ndimage = None


# ---------- triage ----------
def stray_score(img: Image.Image) -> float:
    """% of pixels that are opaque-ish but FAR from the solid subject core.
    High => leftover background blobs (a bad/incomplete cutout)."""
    a = np.asarray(img.convert("RGBA"))[..., 3].astype(np.float32) / 255.0
    core = a > 0.92
    if core.sum() == 0 or ndimage is None:
        return 0.0
    far = ndimage.distance_transform_edt(~core) > 12
    return float(((a > 0.15) & far).mean() * 100.0)


def classify(path: str):
    """Return ('clean'|'opaque'|'blobby', metrics)."""
    im = Image.open(path).convert("RGBA")
    a = np.asarray(im)[..., 3]
    transp = float((a == 0).mean() * 100.0)
    stray = stray_score(im)
    if transp < 1.0:
        return "opaque", dict(transp=transp, stray=stray)   # background baked in
    if stray > 2.0:
        return "blobby", dict(transp=transp, stray=stray)    # half-removed background
    return "clean", dict(transp=transp, stray=stray)


# ---------- cutting ----------
_session = None
def _get_session(model: str):
    global _session
    if _session is None:
        from rembg import new_session
        _session = new_session(model)
    return _session


def recut(path: str, model: str) -> Image.Image:
    from rembg import remove
    src = Image.open(path).convert("RGBA")
    # Feed the raw RGB scene so the model re-segments person vs background.
    rgb = Image.fromarray(np.asarray(src)[..., :3], "RGB")
    out = remove(
        rgb,
        session=_get_session(model),
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=8,
    ).convert("RGBA")

    arr = np.asarray(out).astype(np.float32) / 255.0
    rgbf, a = arr[..., :3].copy(), arr[..., 3]
    if ndimage is not None:
        mask = a > 0.5
        # keep only the largest connected blob (drops stray specks)
        lbl, n = ndimage.label(mask)
        if n > 1:
            sizes = ndimage.sum(np.ones_like(lbl), lbl, range(1, n + 1))
            mask = lbl == (1 + int(np.argmax(sizes)))
        mask = ndimage.binary_fill_holes(mask)
        a = np.where(mask, a, 0.0)
        # de-contaminate the thin edge band with interior colour
        core = ndimage.binary_erosion(mask, iterations=2)
        band = (a > 0) & (~core)
        if core.sum() > 0:
            idx = ndimage.distance_transform_edt(~core, return_distances=False,
                                                 return_indices=True)
            rgbf = np.where(band[..., None], rgbf[tuple(idx)], rgbf)
        a = ndimage.gaussian_filter(a, 0.6)

    res = (np.clip(np.dstack([rgbf, a]), 0, 1) * 255).astype(np.uint8)
    return Image.fromarray(res, "RGBA")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default="assets/characters")
    ap.add_argument("--only", default=None, help="restrict to a character slug, e.g. cork")
    ap.add_argument("--model", default="u2net_human_seg",
                    help="rembg model (u2net_human_seg is best for people)")
    ap.add_argument("--dry-run", action="store_true", help="triage report, no writes")
    args = ap.parse_args()

    if ndimage is None and not args.dry_run:
        print("ERROR: scipy is required. pip install -r tools/requirements.txt", file=sys.stderr)
        sys.exit(1)

    pattern = os.path.join(args.root, "**", "*.png")
    files = sorted(glob.glob(pattern, recursive=True))
    if args.only:
        files = [f for f in files if f"/{args.only}/" in f.replace(os.sep, "/")]
    if not files:
        print(f"No PNGs found under {args.root}", file=sys.stderr)
        sys.exit(1)

    todo, skip = [], []
    for f in files:
        kind, m = classify(f)
        (skip if kind == "clean" else todo).append((f, kind, m))

    print(f"Scanned {len(files)} images  |  to clean: {len(todo)}  |  already clean: {len(skip)}\n")
    for f, kind, m in todo:
        print(f"  CLEAN  [{kind:6}] transp={m['transp']:4.0f}% stray={m['stray']:5.1f}%  {f}")
    for f, kind, m in skip:
        print(f"  skip   [clean ] transp={m['transp']:4.0f}% stray={m['stray']:5.1f}%  {f}")

    if args.dry_run:
        print("\n(dry run — nothing written)")
        return

    print()
    changed = 0
    for f, kind, _ in todo:
        try:
            recut(f, args.model).save(f)
            print(f"  wrote  {f}")
            changed += 1
        except Exception as e:
            print(f"  FAIL   {f}: {e}", file=sys.stderr)
    print(f"\nDone. Re-cut {changed} image(s); left {len(skip)} clean image(s) untouched.")


if __name__ == "__main__":
    main()
