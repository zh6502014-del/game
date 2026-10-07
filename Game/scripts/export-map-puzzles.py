"""Export painted map masters through the existing, unchanged jigsaw silhouettes.

Deterministic asset export only: no illustrated content is added or repainted.
Run with the workspace Python runtime (Pillow), after imagegen art is selected.
"""
import hashlib
import json
import re
from pathlib import Path
from xml.etree import ElementTree

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source-art/STORY-MAP-ART-015"
OUTPUT = ROOT / "assets/story/props/map-art-v2"
MANIFEST = ROOT / "assets/story/map-puzzle-art-manifest.json"
EDGE, VIEW, PAD, TILE = 512, 176, 38, 100


def fingerprint(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def polygon(path):
    """Flatten the existing absolute M/H/V/Q/Z paths for alpha rasterization."""
    tokens = re.findall(r"[A-Za-z]|-?\d+(?:\.\d+)?", path)
    points, index, x, y = [], 0, 0.0, 0.0
    while index < len(tokens):
        command = tokens[index]
        index += 1
        count = {"M": 2, "H": 1, "V": 1, "Q": 4, "Z": 0}.get(command)
        if count is None:
            raise ValueError(f"Unsupported silhouette command: {command}")
        values = list(map(float, tokens[index:index + count]))
        index += count
        if command == "M":
            x, y = values
        elif command == "H":
            x = values[0]
        elif command == "V":
            y = values[0]
        elif command == "Q":
            cx, cy, end_x, end_y = values
            for step in range(1, 65):
                t = step / 64
                points.append(((1-t)**2*x + 2*(1-t)*t*cx + t*t*end_x,
                               (1-t)**2*y + 2*(1-t)*t*cy + t*t*end_y))
            x, y = end_x, end_y
            continue
        elif command == "Z":
            continue
        points.append((x, y))
    return points


def export():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    masters, pieces = [], []
    for family in ("evac", "archive"):
        source = SOURCE / f"{family}.png"
        with Image.open(source) as original:
            original.load()
            if original.width != original.height:
                raise ValueError(f"{family}: master must be square; do not stretch")
            master = original.convert("RGBA")
            if master.getchannel("A").getextrema() != (255, 255):
                raise ValueError(f"{family}: full-bleed paper master must be opaque before silhouette export")
        masters.append({"family": family, "path": str(source.relative_to(ROOT)),
                        "size": list(master.size), "bytes": source.stat().st_size,
                        "sha256": fingerprint(source)})
        for index in range(4):
            part_id = f"{family}-{index}"
            svg = ROOT / f"assets/puzzles/{part_id}.svg"
            shape = ElementTree.parse(svg).find(".//{http://www.w3.org/2000/svg}clipPath/{http://www.w3.org/2000/svg}path").attrib["d"]
            scale = master.width / (2*TILE)
            x, y = (index % 2)*TILE-PAD, (index // 2)*TILE-PAD
            piece = master.transform((EDGE, EDGE), Image.Transform.EXTENT,
                                     (x*scale, y*scale, (x+VIEW)*scale, (y+VIEW)*scale),
                                     Image.Resampling.BICUBIC)
            mask = Image.new("L", (EDGE*4, EDGE*4), 0)
            ImageDraw.Draw(mask).polygon([((px+PAD)*EDGE*4/VIEW, (py+PAD)*EDGE*4/VIEW)
                                         for px, py in polygon(shape)], fill=255)
            mask = mask.resize((EDGE, EDGE), Image.Resampling.LANCZOS)
            piece.putalpha(mask)
            target = OUTPUT / f"{part_id}.webp"
            piece.save(target, "WEBP", quality=87, method=6)
            if target.stat().st_size > 102400:
                raise ValueError(f"{target.name}: exceeds prop budget; review quality before lowering it")
            pieces.append({"id": part_id, "path": str(target.relative_to(ROOT)),
                           "master": str(source.relative_to(ROOT)), "masterSha256": fingerprint(source),
                           "size": list(piece.size), "bytes": target.stat().st_size,
                           "sha256": fingerprint(target), "shapeSource": str(svg.relative_to(ROOT)),
                           "shape": shape, "logicalOrigin": [(index % 2)*TILE, (index // 2)*TILE],
                           "alphaExtrema": list(mask.getextrema())})
    manifest = {"ticket": "STORY-MAP-ART-015", "purpose": "T1 evacuation and C8 archive map jigsaw artwork; schematic geography only",
                "generation": "built-in image_gen; two independently generated selected originals",
                "promptRecord": "source-art/STORY-MAP-ART-015/prompts.json",
                "export": {"script": "scripts/export-map-puzzles.py", "viewBox": [-PAD, -PAD, VIEW, VIEW],
                           "logicalMapSize": [200, 200], "logicalTileSize": [TILE, TILE],
                           "sampling": "shared full-map coordinates; bicubic; no repainting",
                           "alpha": "existing SVG path; 64 samples per quadratic segment, 4x mask then Lanczos",
                           "webpQuality": 87, "webpMethod": 6},
                "masters": masters, "pieces": pieces,
                "runtimeTotalBytes": sum(p["bytes"] for p in pieces),
                "originalTotalBytes": sum(m["bytes"] for m in masters)}
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+"\n")
    print(json.dumps({"pieces": len(pieces), "runtimeBytes": manifest["runtimeTotalBytes"],
                      "sourceBytes": manifest["originalTotalBytes"]}))


if __name__ == "__main__":
    export()
