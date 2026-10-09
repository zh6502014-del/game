"""Deterministic alpha trimming and nine-slice extraction; originals stay untouched."""
from pathlib import Path
import json
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'assets/frames/v1'
(root / 'slices').mkdir(parents=True, exist_ok=True)
manifest = {}
for name, cut in [('hero', 224), ('panel', 208), ('thin', 176)]:
    original = Image.open(Path(__file__).resolve().parents[1] / 'storage/source-art/frame-originals-v1' / (name + '.png')).convert('RGBA')
    bbox = original.getchannel('A').point(lambda a: 255 if a > 16 else 0).getbbox()
    atlas = original.crop(bbox)
    w, h = atlas.size
    atlas.save(root / (name + '.png'), optimize=True)
    xs, ys = [0, cut, w-cut, w], [0, cut, h-cut, h]
    names = [['tl','top','tr'], ['left','center','right'], ['bl','bottom','br']]
    for y in range(3):
        for x in range(3):
            if x == y == 1:
                continue
            atlas.crop((xs[x], ys[y], xs[x+1], ys[y+1])).save(root / 'slices' / f'{name}-{names[y][x]}.png', optimize=True)
    assert atlas.getpixel((w//2, h//2))[3] == 0
    manifest[name] = {'source':f'../../../storage/source-art/frame-originals-v1/{name}.png', 'atlas':f'{name}.png', 'trim':bbox, 'size':[w,h], 'slice':cut, 'repeat':'repeat', 'center':'transparent'}
(root / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
