# Side-by-side palette sheets: hero/shots/palette/{1440,390}-{a,b}-*.png -> sheet-AB-1440.png, sheet-AB-390.png
from PIL import Image, ImageDraw, ImageFont
import os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'hero', 'shots', 'palette'))
F = 'C:/Windows/Fonts/segoeui.ttf'
big, small = ImageFont.truetype(F, 30), ImageFont.truetype(F, 22)
BG, FG, MUTE = (232, 232, 232), (20, 20, 20), (90, 90, 90)
GAP = 14

def fit(path, w, maxh=None):
    im = Image.open(path).convert('RGB'); h = round(im.height * w / im.width); im = im.resize((w, h), Image.LANCZOS)
    return im.crop((0, 0, w, min(h, maxh))) if maxh else im

# ---- 1440: A left, B right
W = 760
rows = [('Hero', '1-hero', None), ('Michigan stage', '2-michigan', None), ('County stage', '3-county', None), ('Content section on paper', '4-services', 900)]
cells = [[fit(f'1440-{t}-{k}.png', W, mh) for t in 'ab'] for _, k, mh in rows]
logo = []
for t in 'ab':
    im = Image.open(f'1440-{t}-1-hero.png').convert('RGB').crop((60, 6, 230, 82)); logo.append(im.resize((im.width * 3, im.height * 3), Image.LANCZOS))
H = 70 + sum(max(c.height for c in r) + 44 for r in cells) + 44 + logo[0].height + 30
s = Image.new('RGB', (W * 2 + GAP, H), BG); d = ImageDraw.Draw(s)
d.text((8, 12), 'A: refined walnut', font=big, fill=FG); d.text((W + GAP + 8, 12), 'B: deep ink', font=big, fill=FG)
y = 60
for (label, _, _), r in zip(rows, cells):
    d.text((8, y), label, font=small, fill=MUTE); y += 34
    for i, c in enumerate(r): s.paste(c, (i * (W + GAP), y))
    y += max(c.height for c in r) + 10
d.text((8, y), 'The logo on each ground (enlarged 3x)', font=small, fill=MUTE); y += 34
for i, c in enumerate(logo): s.paste(c, (i * (W + GAP), y))
s = s.crop((0, 0, W * 2 + GAP, y + logo[0].height + 16)); s.save('sheet-AB-1440.png', optimize=True); print('1440', s.size)

# ---- 390: A and B alternate per stage
w = 300
groups = [('Hero', '1-hero', None), ('County stage', '3-county', None), ('Content section', '4-services', 1060)]
cols = []
for _, k, mh in groups:
    for t in 'ab': cols.append((t, fit(f'390-{t}-{k}.png', w, mh)))
H = 110 + max(c.height for _, c in cols) + 10
s = Image.new('RGB', (len(cols) * (w + GAP) - GAP + 2 * 10, H), BG); d = ImageDraw.Draw(s)
for i, (t, c) in enumerate(cols):
    x = 10 + i * (w + GAP)
    d.text((x, 70), 'A' if t == 'a' else 'B', font=big, fill=FG); s.paste(c, (x, 110))
for gi, (label, _, _) in enumerate(groups):
    d.text((10 + gi * 2 * (w + GAP), 14), label, font=small, fill=MUTE)
d.text((10, 38), 'A: refined walnut      B: deep ink', font=small, fill=MUTE)
s.save('sheet-AB-390.png', optimize=True); print('390', s.size)
