#!/usr/bin/env python3
"""
Re-slice the sprite sheets cleanly and sharpen the cutouts with ESPCN 4x
super-resolution. Re-slices from art-source/sprite-sheets excluding the baked-in
label strip, with a smoother matte, then runs ESPCN x4 and caps the long side at
1000px. Deps: pip install opencv-contrib-python pillow numpy scipy
"""
import os, urllib.request
import numpy as np, cv2
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "art-source", "sprite-sheets")
OUT = os.path.join(ROOT, "assets", "characters")
MODEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ESPCN_x4.pb")
MODEL_URL = "https://raw.githubusercontent.com/fannymonori/TF-ESPCN/master/export/ESPCN_x4.pb"
MAX_SIDE = 1000

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
    g = g.astype(np.float32); m = ndimage.uniform_filter(g, w); m2 = ndimage.uniform_filter(g * g, w)
    return np.sqrt(np.maximum(m2 - m * m, 0))

def fg_tex(g):
    return ((g > 8) & (lstd(g, 5) > 3)) | (g > 20)

def _bands(profile, H, bridge, minh):
    on = profile > 0.03; out = []; i = 0
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

def blocks(g, W, H):
    strict = (g > 30).sum(1).astype(float) / W
    tex = fg_tex(g).sum(1).astype(float) / W
    sb = _bands(ndimage.uniform_filter1d(strict, 9), H, bridge=6, minh=80)
    tb = _bands(ndimage.uniform_filter1d(tex, 9), H, bridge=18, minh=120)
    expr = sb[0]
    pose = [b for b in tb if b[0] > expr[1] - 5][-1]
    return expr, pose

def matte(cell):
    arr = np.asarray(cell.convert("RGB")).astype(np.float32)
    g = np.asarray(cell.convert("L")).astype(np.float32); std = lstd(g, 5)
    flat = (g < 8) & (std < 3)
    lbl, n = ndimage.label(flat)
    bl = set(lbl[0, :]) | set(lbl[-1, :]) | set(lbl[:, 0]) | set(lbl[:, -1]); bl.discard(0)
    subj = ~np.isin(lbl, list(bl))
    subj = ndimage.binary_closing(subj, iterations=2)
    subj = ndimage.binary_fill_holes(subj)
    l2, n2 = ndimage.label(subj)
    if n2 > 1:
        s = ndimage.sum(np.ones_like(l2), l2, range(1, n2 + 1)); big = s.max()
        subj = np.isin(l2, [i + 1 for i, v in enumerate(s) if v > 0.05 * big])
    subj = ndimage.binary_erosion(subj, iterations=1)
    a = ndimage.gaussian_filter(subj.astype(np.float32), 1.1)
    core = ndimage.binary_erosion(subj, iterations=2)
    band = (a > 0) & (~core)
    if core.sum() > 0:
        idx = ndimage.distance_transform_edt(~core, return_distances=False, return_indices=True)
        arr = np.where(band[..., None], arr[tuple(idx)], arr)
    out = np.dstack([arr, a * 255]).clip(0, 255).astype(np.uint8)
    aa = out[..., 3]
    r = np.where(aa.any(1))[0]; c = np.where(aa.any(0))[0]
    if len(r) == 0:
        return None
    pad = 6
    y0, y1 = max(r[0] - pad, 0), min(r[-1] + pad, aa.shape[0])
    x0, x1 = max(c[0] - pad, 0), min(c[-1] + pad, aa.shape[1])
    return Image.fromarray(out[y0:y1, x0:x1], "RGBA")

_sr = None
def get_sr():
    global _sr
    if _sr is None:
        if not os.path.exists(MODEL):
            print("Downloading ESPCN_x4 model ...")
            urllib.request.urlretrieve(MODEL_URL, MODEL)
        _sr = cv2.dnn_superres.DnnSuperResImpl_create()
        _sr.readModel(MODEL); _sr.setModel("espcn", 4)
    return _sr

def upscale(im):
    arr = np.asarray(im); rgb = arr[..., :3]; a = arr[..., 3]
    up = cv2.cvtColor(get_sr().upsample(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)), cv2.COLOR_BGR2RGB)
    H, W = up.shape[:2]
    ua = cv2.resize(a, (W, H), interpolation=cv2.INTER_LANCZOS4)
    res = Image.fromarray(np.dstack([up, ua]).astype(np.uint8), "RGBA")
    if max(res.size) > MAX_SIDE:
        s = MAX_SIDE / max(res.size)
        res = res.resize((round(res.width * s), round(res.height * s)), Image.LANCZOS)
    return res


def main():
    for fname, (slug, exprs, posemap) in CFG.items():
        path = os.path.join(SRC, fname)
        if not os.path.exists(path):
            print(f"  MISSING {path}"); continue
        im = Image.open(path).convert("RGB")
        g = np.asarray(im.convert("L")).astype(np.float32); H, W = g.shape
        fg = fg_tex(g)
        (ey0, ey1), (py0, py1) = blocks(g, W, H)
        os.makedirs(os.path.join(OUT, slug, "expressions"), exist_ok=True)
        os.makedirs(os.path.join(OUT, slug, "poses"), exist_ok=True)

        sub = fg[ey0:ey1]; cm = sub.sum(0).astype(float)
        nz = np.where(cm > cm.max() * 0.05)[0]; x0, x1 = nz[0], nz[-1]
        edges = np.linspace(x0, x1, len(exprs) + 1).astype(int)
        for k in range(len(exprs)):
            mm = matte(im.crop((edges[k], ey0, edges[k + 1], ey1)))
            if mm:
                upscale(mm).save(os.path.join(OUT, slug, "expressions", f"{slug}-expr-{exprs[k]}.png"))

        subb = fg[py0:py1]; bc = (subb.sum(0) / max(subb.sum(0).max(), 1)) > 0.02
        on = bc; runs = []; i = 0
        while i < W:
            if on[i]:
                j = i
                while j < W and (on[j] or (j + 12 < W and on[j:j + 12].any())):
                    j += 1
                if j - i > 40:
                    runs.append((i, j))
                i = j
            else:
                i += 1
        for idx, (xs, xe) in enumerate(runs):
            if idx in posemap:
                mm = matte(im.crop((xs, py0, xe, py1)))
                if mm:
                    upscale(mm).save(os.path.join(OUT, slug, "poses", f"{slug}-pose-{posemap[idx]}.png"))
        print(f"  {slug}: {len(exprs)} expressions + {len(posemap)} poses (clean + ESPCN x4)")
    print("Done.")


if __name__ == "__main__":
    main()
