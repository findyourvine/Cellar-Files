#!/usr/bin/env python3
"""
TEST ONLY — restores the faces on two pose images with GFPGAN and writes the
results to a new  face_test/  folder. Your real assets/ are NOT touched.
Compare the outputs to the originals before deciding to apply this everywhere.

Run inside the venv:
    source ~/.facerestore/bin/activate
    python tools/restore_test.py
"""
import os
import cv2
import numpy as np
from PIL import Image
from gfpgan import GFPGANer

MODEL = "https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth"

TESTS = [
    "assets/characters/malbec-mike/poses/malbec-mike-pose-idle.png",
    "assets/characters/cabernet-jack/poses/cabernet-jack-pose-idle.png",
]

print("Loading GFPGAN (first run downloads ~350MB of models)...")
restorer = GFPGANer(model_path=MODEL, upscale=2, arch="clean",
                    channel_multiplier=2, bg_upsampler=None)

os.makedirs("face_test", exist_ok=True)
for src in TESTS:
    if not os.path.exists(src):
        print("  SKIP (not found):", src)
        continue
    try:
        arr = np.array(Image.open(src).convert("RGBA"))
        rgb, alpha = arr[..., :3], arr[..., 3]
        bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
        _, _, out = restorer.enhance(bgr, has_aligned=False,
                                     only_center_face=True, paste_back=True)
        out_rgb = cv2.cvtColor(out, cv2.COLOR_BGR2RGB)
        if out_rgb.shape[:2] != alpha.shape:
            alpha = cv2.resize(alpha, (out_rgb.shape[1], out_rgb.shape[0]),
                               interpolation=cv2.INTER_LANCZOS4)
        name = os.path.basename(src).replace(".png", "_RESTORED.png")
        Image.fromarray(np.dstack([out_rgb, alpha]), "RGBA").save(os.path.join("face_test", name))
        print("  restored ->", "face_test/" + name)
    except Exception as e:
        print("  ERROR on", src, "->", repr(e))

print("Done. Open the files in face_test/ and compare to the originals.")
