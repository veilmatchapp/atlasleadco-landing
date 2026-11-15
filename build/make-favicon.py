# Derives the favicon set from the figure in atlas-logo.png (the logo file itself is never modified).
from PIL import Image, ImageDraw
src = Image.open('atlas-logo.png').convert('RGBA')
fig = src.crop((0, 0, 176, 281))
fig = fig.crop(fig.getbbox())
INK = (16, 28, 43, 255)
def tile(n):
    S = n * 4
    t = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(t).rounded_rectangle((0, 0, S - 1, S - 1), radius=int(S * .2), fill=INK)
    h = int(S * .84); w = round(fig.width * h / fig.height)
    f = fig.resize((w, h), Image.LANCZOS)
    t.alpha_composite(f, ((S - w) // 2, (S - h) // 2))
    return t.resize((n, n), Image.LANCZOS)
out = 'site/'
for n, name in ((32, 'favicon-32.png'), (180, 'apple-touch-icon.png'), (192, 'icon-192.png'), (512, 'icon-512.png')):
    tile(n).save(out + name)
tile(256).save(out + 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
