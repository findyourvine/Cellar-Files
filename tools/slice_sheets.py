#!/usr/bin/env python3
"""
Slice the per-character sprite sheets in art-source/sprite-sheets/ into the
individual transparent PNGs the game loads, mapped to the exact filenames in
assets/characters/<slug>/{expressions,poses}/.

Each sheet is one character: a top row of expression portraits and a bottom row
of full-body poses, on a solid black background. This tool:
  1. Finds the two figure rows (texture-aware, so dark clothing on black is kept).
  2. Splits the expression row into N even cells (N = number of expression keys).
  3. Detects the pose cells in the bottom row.
  4. Knocks out the black background with a texture-aware matte (flat black =
     background; textured/lit pixels = subject), de-fringes the edge, auto-crops.
  5. Saves each cell to its game filename using the CFG map below.

The CFG order matches data.js, so the produced files drop straight in with no
code changes. Sheets sometimes carry extra cells (e.g. an alternate "posing"
shot) that the game doesn't reference — those indices are simply omitted.

Run:  python tools/slice_sheets.py
"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "art-source", "sprite-sheets")
OUT = os.path.join(ROOT, "assets", "characters")

# sheet file -> (slug, expression keys in data.js order, {pose_cell_index: pose_key})
CFG = {
    "Cork.png":          ("cork",          ["confident", "thinking", "amused", "surprised"],                {0: "idle", 1: "walking", 2: "victory"}),
    "malbec_mike.png":   ("malbec-mike",   ["charming", "cocky", "laughing", "focused", "winking"],          {0: "idle", 1: "walking", 2: "victory"}),
    "lady_champagne.png":("champagne",     ["elegant", "playful", "knowing", "curious", "mysterious"],        {0: "idle", 1: "walking", 2: "victory"}),
    "Corkfather.png":    ("corkfather",    ["confident", "amused", "arrogant", "thinking", "threatening"],    {0: "idle", 1: "walking", 2: "victory"}),
    "pinot.png":         ("pinot-noir",    ["winemaker", "sommelier", "auctioneer", "wine-critic", "importer"], {0: "idle", 1: "walking", 3: "disappearing"}),
    "decanter.png":      ("decanter",      ["confident", "amused", "thinking", "focused", "intrigued"],       {0: "idle", 1: "walking", 3: "victory"}),
    "rose_renee.png":    ("rose-renee",    ["elegant", "playful", "knowing", "curious", "mysterious"],        {0: "idle", 1: "walking", 2: "victory"}),
    "cabernet_jack.png": ("cabernet-jack", ["confident", "amused", "focused", "surprised", "determined"],     {0: "idle", 1: "walking", 2: "victory"}),
}


def lstd(g, w=5):
    g = g.astype(np.float32)
    m = ndimage.uniform_filter(g, w)
    m2 = ndimage.uniform_filter(g * g, w)
    return np.sqrt(np.maximum(m2 - m * m, 0))


def fg_mask(g):
    """Foreground = bright OR textured. Flat black background fails both."""
    return ((g > 8) & (lstd(g, 5) > 3)) | (g > 20)


def figure_blocks(g, W, H):
    m = fg_mask(g)
    prof = ndimage.uniform_filter1d(m.sum(1).astype(float) / W, 9)
    on = prof > 0.03
    bands, i = [], 0
    while i < H:
        if on[i]:
            j = i
            while j < H and (on[j] or (j + 18 < H and on[j:j + 18].any())):
                j += 1
            bands.append((i, j, float(prof[i:j].max())))
            i = j
        else:
            i += 1
    figs = [(y0, y1) for (y0, y1, pk) in bands if (y1 - y0) > 120 and pk > 0.10]
    return figs[:2]


def runs(on, minw=40, bridge=12):
    out, i, W = [], 0, len(on)
    while i < W:
        if on[i]:
            j = i
            while j < W and (on[j] or (j + bridge < W and on[j:j + bridge].any())):
                j += 1
            if j - i > minw:
                out.append((i, j))
            i = j
        else:
            i += 1
    return out


def matte(cell):
    arr = np.asarray(cell.convert("RGB")).astype(np.float32)
    g = np.asarray(cell.convert("L")).astype(np.float32)
    std = lstd(g, 5)
    flat_dark = (g < 8) & (std < 3)
    lbl, n = ndimage.label(flat_dark)
    border = set(lbl[0, :]) | set(lbl[-1, :]) | set(lbl[:, 0]) | set(lbl[:, -1])
    border.discard(0)
    subj = ~np.isin(lbl, list(border))
    subj = ndimage.binary_closing(subj, iterations=1)
    subj = ndimage.binary_fill_holes(subj)
    l2, n2 = ndimage.label(subj)
    if n2 > 1:
        s = ndimage.sum(np.ones_like(l2), l2, range(1, n2 + 1))
        big = s.max()
        keep = []
        for i, v in enumerate(s):
            if v < 0.04 * big:
                continue
            ys, xs = np.where(l2 == i + 1)
            hh, ww = ys.max() - ys.min() + 1, xs.max() - xs.min() + 1
            if hh < 14 and ww > 6 * hh:   # drop thin baked-in label text
                continue
            keep.append(i + 1)
        subj = np.isin(l2, keep)
    a = ndimage.gaussian_filter(subj.astype(np.float32), 0.8)
    core = ndimage.binary_erosion(subj, iterations=2)
    band = (a > 0) & (~core)
    if core.sum() > 0:
        idx = ndimage.distance_transform_edt(~core, return_distances=False, return_indices=True)
        arr = np.where(band[..., None], arr[tuple(idx)], arr)
    out = np.dstack([arr, a * 255]).clip(0, 255).astype(np.uint8)
    aa = out[..., 3]
    r = np.where(aa.any(1))[0]
    c = np.where(aa.any(0))[0]
    if len(r) == 0:
        return None
    pad = 6
    y0, y1 = max(r[0] - pad, 0), min(r[-1] + pad, aa.shape[0])
    x0, x1 = max(c[0] - pad, 0), min(c[-1] + pad, aa.shape[1])
    return Image.fromarray(out[y0:y1, x0:x1], "RGBA")


def main():
    for fname, (slug, exprs, posemap) in CFG.items():
        path = os.path.join(SRC, fname)
        if not os.path.exists(path):
            print(f"  MISSING {path}")
            continue
        im = Image.open(path).convert("RGB")
        g = np.asarray(im.convert("L")).astype(np.float32)
        H, W = g.shape
        fg = fg_mask(g)
        figs = figure_blocks(g, W, H)
        if len(figs) < 2:
            print(f"  WARN {slug}: found {len(figs)} figure rows")
            continue
        (ey0, ey1), (py0, py1) = figs[0], figs[1]
        os.makedirs(os.path.join(OUT, slug, "expressions"), exist_ok=True)
        os.makedirs(os.path.join(OUT, slug, "poses"), exist_ok=True)

        # expressions: even split across the row
        sub = fg[ey0:ey1]
        cm = sub.sum(0).astype(float)
        nz = np.where(cm > cm.max() * 0.05)[0]
        x0, x1 = nz[0], nz[-1]
        edges = np.linspace(x0, x1, len(exprs) + 1).astype(int)
        for k in range(len(exprs)):
            mm = matte(im.crop((edges[k], ey0, edges[k + 1], ey1)))
            if mm:
                mm.save(os.path.join(OUT, slug, "expressions", f"{slug}-expr-{exprs[k]}.png"))

        # poses: detect cells, map by index
        subb = fg[py0:py1]
        bc = (subb.sum(0) / max(subb.sum(0).max(), 1)) > 0.02
        for idx, (xs, xe) in enumerate(runs(bc)):
            if idx in posemap:
                mm = matte(im.crop((xs, py0, xe, py1)))
                if mm:
                    mm.save(os.path.join(OUT, slug, "poses", f"{slug}-pose-{posemap[idx]}.png"))
        print(f"  {slug}: {len(exprs)} expressions + {len(posemap)} poses")
    print("Done.")


if __name__ == "__main__":
    main()
