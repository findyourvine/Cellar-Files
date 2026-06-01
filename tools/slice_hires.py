#!/usr/bin/env python3
"""
Slice the HIGH-RES (Upscayl 4x) sprite sheets into clean transparent cutouts.

Use this AFTER upscaling each sheet with Upscayl (Ultrasharp, 4x). Drop the
upscaled files into art-source/sprite-sheets/ (any name is fine as long as it
starts with the original name, e.g. "Cork_upscayl_4x.png"), then run this.

Differences from the old slicer:
  - resolution-independent: all thresholds scale with the sheet size, so it
    works whether the sheet is 1536px or 6144px wide.
  - robust matte: samples the actual corner colour, so it cuts out a pure-black
    OR a slightly-grey background (Upscayl sometimes lightens black).
  - excludes the baked-in label strip, smooth edges, caps output at 1100px.
  - no upscaling here (the sheet is already high-res).

Deps:  pip install pillow numpy scipy   (no OpenCV / no model needed)
Run:   python tools/slice_hires.py
"""
import os, glob
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "art-source", "sprite-sheets")
OUT = os.path.join(ROOT, "assets", "characters")
MAX_SIDE = 1100

CFG = {
    "Cork":          ("cork",          ["confident", "thinking", "amused", "surprised"],                {0: "idle", 1: "walking", 2: "victory"}),
    "malbec_mike":   ("malbec-mike",   ["charming", "cocky", "laughing", "focused", "winking"],          {0: "idle", 1: "walking", 2: "victory"}),
    "lady_champagne":("champagne",     ["elegant", "playful", "knowing", "curious", "mysterious"],        {0: "idle", 1: "walking", 2: "victory"}),
    "Corkfather":    ("corkfather",    ["confident", "amused", "arrogant", "thinking", "threatening"],    {0: "idle", 1: "walking", 2: "victory"}),
    "pinot":         ("pinot-noir",    ["winemaker", "sommelier", "auctioneer", "wine-critic", "importer"], {0: "idle", 1: "walking", 3: "disappearing"}),
    "decanter":      ("decanter",      ["confident", "amused", "thinking", "focused", "intrigued"],       {0: "idle", 1: "walking", 3: "victory"}),
    "rose_renee":    ("rose-renee",    ["elegant", "playful", "knowing", "curious", "mysterious"],        {0: "idle", 1: "walking", 2: "victory"}),
    "cabernet_jack": ("cabernet-jack", ["confident", "amused", "focused", "surprised", "determined"],     {0: "idle", 1: "walking", 2: "victory"}),
}


def find_sheet(stem):
    cands = [p for p in glob.glob(os.path.join(SRC, "*.png"))
             if os.path.basename(p) == stem + ".png"
             or os.path.basename(p).startswith(stem + "_")]
    if not cands:
        return None
    # if old + upscaled both present, use the highest-resolution one
    return max(cands, key=lambda p: Image.open(p).size[0])


def lstd(g, w):
    g = g.astype(np.float32); m = ndimage.uniform_filter(g, w); m2 = ndimage.uniform_filter(g * g, w)
    return np.sqrt(np.maximum(m2 - m * m, 0))


def corner_bg(rgb):
    h, w = rgb.shape[:2]; k = max(6, h // 60)
    patches = np.concatenate([
        rgb[:k, :k].reshape(-1, 3), rgb[:k, -k:].reshape(-1, 3),
        rgb[-k:, :k].reshape(-1, 3), rgb[-k:, -k:].reshape(-1, 3)])
    return np.median(patches, 0)


def fg_tex(rgb, win):
    g = rgb.mean(2)
    bg = corner_bg(rgb)
    dist = np.sqrt(((rgb.astype(np.float32) - bg) ** 2).sum(2))
    return (dist > 28) & ((lstd(g, win) > 3) | (dist > 45))


def blocks(fgrow, H):
    prof = ndimage.uniform_filter1d(fgrow, max(3, H // 110))
    on = prof > 0.03
    bridge = max(2, int(H * 0.006)); minh = int(H * 0.11)
    out = []; i = 0
    while i < H:
        if on[i]:
            j = i
            while j < H and (on[j] or (j + bridge < H and on[j:j + bridge].any())):
                j += 1
            if j - i > minh:
                out.append((i, j))
            i = j
        else:
            i += 1
    return out


def matte(cell_rgb, scale):
    arr = cell_rgb.astype(np.float32)
    bg = corner_bg(cell_rgb)
    dist = np.sqrt(((arr - bg) ** 2).sum(2))
    win = max(3, int(5 * scale) | 1)
    std = lstd(arr.mean(2), win)
    flat_bg = (dist < 24) & (std < 3)
    lbl, n = ndimage.label(flat_bg)
    border = set(lbl[0, :]) | set(lbl[-1, :]) | set(lbl[:, 0]) | set(lbl[:, -1]); border.discard(0)
    subj = ~np.isin(lbl, list(border))
    it = max(1, int(round(scale)))
    subj = ndimage.binary_closing(subj, iterations=it)
    subj = ndimage.binary_fill_holes(subj)
    l2, n2 = ndimage.label(subj)
    if n2 > 1:
        s = ndimage.sum(np.ones_like(l2), l2, range(1, n2 + 1)); big = s.max()
        keep = []
        for i, v in enumerate(s):
            if v < 0.04 * big:
                continue
            ys, xs = np.where(l2 == i + 1)
            hh, ww = ys.max() - ys.min() + 1, xs.max() - xs.min() + 1
            if hh < 14 * scale and ww > 6 * hh:
                continue
            keep.append(i + 1)
        subj = np.isin(l2, keep)
    subj = ndimage.binary_erosion(subj, iterations=it)
    a = ndimage.gaussian_filter(subj.astype(np.float32), 1.1 * scale)
    core = ndimage.binary_erosion(subj, iterations=2 * it)
    band = (a > 0) & (~core)
    if core.sum() > 0:
        idx = ndimage.distance_transform_edt(~core, return_distances=False, return_indices=True)
        arr = np.where(band[..., None], arr[tuple(idx)], arr)
    out = np.dstack([arr, a * 255]).clip(0, 255).astype(np.uint8)
    aa = out[..., 3]
    r = np.where(aa.any(1))[0]; c = np.where(aa.any(0))[0]
    if len(r) == 0:
        return None
    pad = int(6 * scale)
    y0, y1 = max(r[0] - pad, 0), min(r[-1] + pad, aa.shape[0])
    x0, x1 = max(c[0] - pad, 0), min(c[-1] + pad, aa.shape[1])
    img = Image.fromarray(out[y0:y1, x0:x1], "RGBA")
    if max(img.size) > MAX_SIDE:
        f = MAX_SIDE / max(img.size)
        img = img.resize((round(img.width * f), round(img.height * f)), Image.LANCZOS)
    return img


def main():
    for stem, (slug, exprs, posemap) in CFG.items():
        path = find_sheet(stem)
        if not path:
            print(f"  MISSING sheet for {stem} in {SRC}"); continue
        rgb = np.asarray(Image.open(path).convert("RGB"))
        H, W = rgb.shape[:2]
        scale = max(1.0, W / 1536.0)
        win = max(3, int(5 * scale) | 1)
        fg = fg_tex(rgb, win)
        bg = corner_bg(rgb)
        dist = np.sqrt(((rgb.astype(np.float32) - bg) ** 2).sum(2))
        strict = (dist > 55).sum(1).astype(float) / W   # strong contrast = faces/bodies, not faint labels
        sb = blocks(strict, H)                         # expressions (bright) -> no labels
        tb = blocks(fg.sum(1).astype(float) / W, H)    # poses (texture) -> dark clothing kept
        if not sb or not tb:
            print(f"  WARN {slug}: blocks {len(sb)}/{len(tb)}"); continue
        ey0, ey1 = sb[0]
        py0, py1 = [b for b in tb if b[0] > ey1 - 5][-1]
        os.makedirs(os.path.join(OUT, slug, "expressions"), exist_ok=True)
        os.makedirs(os.path.join(OUT, slug, "poses"), exist_ok=True)

        sub = fg[ey0:ey1]; cm = sub.sum(0).astype(float)
        nz = np.where(cm > cm.max() * 0.05)[0]; x0, x1 = nz[0], nz[-1]
        edges = np.linspace(x0, x1, len(exprs) + 1).astype(int)
        for k in range(len(exprs)):
            mm = matte(rgb[ey0:ey1, edges[k]:edges[k + 1]], scale)
            if mm:
                mm.save(os.path.join(OUT, slug, "expressions", f"{slug}-expr-{exprs[k]}.png"))

        subb = fg[py0:py1]; bc = (subb.sum(0) / max(subb.sum(0).max(), 1)) > 0.02
        on = bc; runs = []; i = 0; brW = max(4, int(W * 0.008)); minW = int(W * 0.026)
        while i < W:
            if on[i]:
                j = i
                while j < W and (on[j] or (j + brW < W and on[j:j + brW].any())):
                    j += 1
                if j - i > minW:
                    runs.append((i, j))
                i = j
            else:
                i += 1
        for idx, (xs, xe) in enumerate(runs):
            if idx in posemap:
                mm = matte(rgb[py0:py1, xs:xe], scale)
                if mm:
                    mm.save(os.path.join(OUT, slug, "poses", f"{slug}-pose-{posemap[idx]}.png"))
        print(f"  {slug}: {len(exprs)} expressions + {len(posemap)} poses  (from {W}x{H})")
    print("Done.")


if __name__ == "__main__":
    main()
