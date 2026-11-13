# Builds the before/after sheets for the globe change: site/shots/before-dots vs site/shots/final.
from PIL import Image, ImageDraw, ImageFont
import os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'site', 'shots'))
F = 'C:/Windows/Fonts/segoeui.ttf'
font, small = ImageFont.truetype(F, 26), ImageFont.truetype(F, 22)
BG, FG = (28, 20, 16), (242, 234, 219)
names = ['1-globe', '2-dive', '2-michigan', '3-county', '4-handoff', '4-laptop']
cap = {'1-globe': 'Stage 1: the globe', '2-dive': 'Stage 2: the dive', '2-michigan': 'Stage 2: Michigan', '3-county': 'Stage 3: the county', '4-handoff': 'Stage 4: hand-off', '4-laptop': 'Stage 4: the laptop'}

def sheet(tag, cw, ch, per, out):
    bar, gap = 40, 10
    blocks = [names[i:i + per] for i in range(0, 6, per)]
    W = cw * per + gap * (per - 1)
    H = len(blocks) * (2 * (bar + ch + gap) + 40) + 10
    s = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(s); y = 0
    for blk in blocks:
        for label, folder in (('Before: gold dot continents', 'before-dots'), ('After: faint grid and thin coastlines', 'final')):
            d.text((6, y + 5), label, font=font, fill=FG); y += bar
            for j, n in enumerate(blk):
                s.paste(Image.open(f'{folder}/{tag}-{n}.png').convert('RGB').resize((cw, ch), Image.LANCZOS), (j * (cw + gap), y))
            y += ch + gap
        for j, n in enumerate(blk):
            d.text((j * (cw + gap) + (cw - d.textlength(cap[n], font=small)) // 2, y), cap[n], font=small, fill=(200, 190, 175))
        y += 40
    s.crop((0, 0, W, y)).save(out, optimize=True); print(out, s.crop((0, 0, W, y)).size)

sheet('1440', 620, 388, 3, 'final/sheet-1440-before-after.png')
sheet('390', 290, 628, 6, 'final/sheet-390-before-after.png')
