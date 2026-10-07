"""Resize/crop/encode authorized imagegen outputs; no painting or synthesis."""
import hashlib
import json
import shutil
import sys
from pathlib import Path
from PIL import Image

BASE = Path(__file__).resolve().parent
ROOT = BASE.parents[1]
MANIFEST = ROOT / 'assets/story/search-interact-manifest.json'

def inspect(path):
    with Image.open(path) as im:
        im.load()
        a = im.convert('RGBA').getchannel('A')
        return {'path': str(path.relative_to(ROOT)), 'width': im.width, 'height': im.height,
                'bytes': path.stat().st_size,
                'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'mode': im.mode,
                'alphaExtrema': list(a.getextrema()), 'alphaBounds': list(a.getbbox()),
                'alphaBoundsAt16': list(a.point(lambda x: 255 if x >= 16 else 0).getbbox()),
                'alphaBoundsAt128': list(a.point(lambda x: 255 if x >= 128 else 0).getbbox())}

asset_id, tool_path = sys.argv[1:3]
assert asset_id in {'search-folio', 'search-cloth', 'search-panel'}
src = BASE / (asset_id + '.png')
dest = ROOT / 'assets/story/props' / (asset_id + '.webp')
assert not src.exists() and not dest.exists(), 'No overwrites allowed'
shutil.copy2(tool_path, src)
im = Image.open(src).convert('RGBA')
a = im.getchannel('A')
assert a.getextrema()[0] == 0, 'Source does not have actual transparency'
box = a.point(lambda x: 255 if x >= 16 else 0).getbbox()
box = (max(0,box[0]-8), max(0,box[1]-8), min(im.width,box[2]+8), min(im.height,box[3]+8))
im = im.crop(box)
im.thumbnail((512,512), Image.Resampling.LANCZOS)
quality = None
for q in [90,85,80,75,70]:
    im.save(dest, 'WEBP', quality=q, method=6, exact=True, alpha_quality=100)
    if dest.stat().st_size <= 102400:
        quality=q
        break
assert quality is not None, 'Runtime over budget; report rather than relaxing budget'
entry = {'id':asset_id,'generation':json.loads((BASE/(asset_id+'.request.json')).read_text()),
         'toolOutputPath':tool_path,'source':inspect(src),'runtime':inspect(dest),
         'derivation':{'software':'Pillow','cropping':'trim outer transparent margin at alpha>=16, retain 8 source pixels of padding',
                       'sourceCropBox':list(box),'resize':'proportional contain within 512x512, no upscale',
                       'filter':'LANCZOS','format':'WebP','quality':quality,'method':6,'exact':True,'alpha_quality':100,
                       'paintingOrSynthesis':False},'visualReview':'pending'}
m = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {
    'task':'STORY-INTERACT-012-ART','status':'in-progress','mode':'built-in image_gen',
    'budget':{'runtimeSingleBytes':102400,'runtimeTotalBytes':307200,'maxWidth':512,'maxHeight':512},'assets':[]}
assert asset_id not in [x['id'] for x in m['assets']]
m['assets'].append(entry)
m['totals']={'runtimeBytes':sum(x['runtime']['bytes'] for x in m['assets']),
             'sourceBytes':sum(x['source']['bytes'] for x in m['assets'])}
MANIFEST.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'id':asset_id,'runtime':entry['runtime'],'source':entry['source']},ensure_ascii=False))
