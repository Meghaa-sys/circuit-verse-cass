"""
Regenerates the WebP layers in public/assets from the two reference images.

  pip install pillow numpy opencv-python-headless rembg onnxruntime
  python tools/extract_assets.py reference/hero-reference.png reference/lab-background-original.png public/assets

Outputs
  lab-background.webp   – the lab scene (backdrop plane in the 3D hero)
  mascot.webp           – hooded character, transparent, chip + orbit rings REMOVED (the 3D chip/rings replace them)
  mascot-full.webp      – same character with the baked chip/rings (static / reduced-motion fallback)
  logo-infinity.webp    – infinity logo cut-out (violet/lavender identity preserved)
The crop boxes below are in pixels of the 1671x941 hero reference.
"""
import sys
from pathlib import Path
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter
from rembg import new_session, remove

hero_ref, bg_ref, out = sys.argv[1], sys.argv[2], Path(sys.argv[3])
out.mkdir(parents=True, exist_ok=True)
sess = new_session('isnet-general-use')

def save(im, name, q=88):
    im.save(out / name, 'WEBP', quality=q, method=6, exact=True)

def upscale(im, k):
    return im.resize((im.width * k, im.height * k), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.4, percent=60, threshold=2))

# 1 ─ background
save(Image.open(bg_ref).convert('RGB'), 'lab-background.webp')

ref = Image.open(hero_ref).convert('RGB')

# 2 ─ mascot cut-out (with chip) and a variant without chip / rings
full = remove(ref.crop((760, 120, 1440, 650)), session=sess)
save(upscale(full, 2), 'mascot-full.webp', 90)

a = np.array(full); al = a[:, :, 3].copy(); H, W = al.shape
op = cv2.morphologyEx(al, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
reg = np.zeros_like(al); reg[:, :290] = 255; reg[400:, :] = 0
al = np.where(reg > 0, op, al)                      # strip thin ring lines on the left
poly = Image.new('L', (W, H), 0)
ImageDraw.Draw(poly).polygon([(40,160),(215,160),(222,215),(246,255),(250,275),(244,300),(236,326),(135,326),(135,312),(40,312)], fill=255)
pm = np.array(poly) > 0
al = np.where(pm, 0, al)                            # cut the chip blob
n, lab, st, _ = cv2.connectedComponentsWithStats((al > 16).astype(np.uint8), 8)
al = np.where(lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA]), al, 0).astype(np.uint8)
edge = cv2.dilate(pm.astype(np.uint8), np.ones((9, 9), np.uint8)) - pm.astype(np.uint8)
al = np.where(edge > 0, np.minimum(al, cv2.GaussianBlur(al, (0, 0), 2.2)), al)
a[:, :, 3] = al
save(upscale(Image.fromarray(a), 2), 'mascot.webp', 90)

# 3 ─ infinity logo
logo = remove(ref.crop((345, 165, 625, 300)), session=sess)
logo = logo.crop(logo.getbbox())
save(upscale(logo, 3), 'logo-infinity.webp', 92)
print('done →', out)
