"""Cut Noto Serif TC (variable, wght 200–900) down to the characters the game actually uses.

Source: storage/fonts/NotoSerifTC-wght.ttf (full Google Fonts build, kept locally, not on GitHub).
The old Google unicode-range slices and their CSS are archived in storage/fonts/ (no page uses them).

Output (three files, each loaded by the browser only when a character in its range is drawn):
  assets/fonts/noto-serif-tc-game/latin-<hash>.woff2   ASCII, Latin, punctuation, symbols (< U+2E80)
  assets/fonts/noto-serif-tc-game/ui-<hash>.woff2      CJK used by the shared UI (home, duel, battle, menus)
  assets/fonts/noto-serif-tc-game/story-<hash>.woff2   CJK used only by scripts the home/duel pages do not load
  src/css/base/fonts.game.css                   @font-face rules with exact unicode-range
Characters are collected from src/js/*.js, the HTML entries, CSS sources and the web manifest.
Anything outside the set falls back to the system serif (the game has no free-text input).

After adding or editing in-game text:
    python3 scripts/subset-fonts.py && python3 scripts/build-css.py && python3 scripts/version-assets.py
    python3 scripts/subset-fonts.py --check   # exit 1 when text uses a character missing from the subset
"""
from pathlib import Path
import hashlib
import re
import sys

root = Path(__file__).resolve().parent.parent
SOURCE = root / 'storage' / 'fonts' / 'NotoSerifTC-wght.ttf'
OUT_DIR = root / 'assets' / 'fonts' / 'noto-serif-tc-game'
OUT_CSS = root / 'src' / 'css' / 'base' / 'fonts.game.css'
CJK_START = 0x2E80
ALWAYS = set(range(0x20, 0x7F))  # full printable ASCII, so numbers/labels built at runtime never fall back


def chars_of(files) -> set:
    cps = set()
    for f in files:
        text = f.read_text(encoding='utf8')
        text += ''.join(chr(int(h, 16)) for h in re.findall(r'\\u([0-9a-fA-F]{4})', text))
        cps |= {ord(c) for c in text if ord(c) >= 0x20}
    return cps


def groups():
    js = sorted((root / 'src' / 'js').glob('*.js'))
    # Scripts loaded by the home and free-duel pages count as UI; everything else only runs in story mode.
    shared = set()
    for page in ('index.html', 'duel.html'):
        shared |= set(re.findall(r'src="src/js/([^"?]+\.js)', (root / page).read_text(encoding='utf8')))
    story_js = [p for p in js if p.name not in shared]
    ui_files = [p for p in js if p.name in shared] + sorted(root.glob('*.html')) + [root / 'manifest.webmanifest']
    ui_files += [p for p in (root / 'src' / 'css').rglob('*.css') if 'dist' not in p.parts and not p.name.startswith('fonts.')]
    ui, story = chars_of(ui_files), chars_of(story_js)
    every = ui | story | ALWAYS
    return {
        'latin': {c for c in every if c < CJK_START},
        'ui': {c for c in ui if c >= CJK_START},
        'story': {c for c in story - ui if c >= CJK_START},
    }


def parse_ranges(spec: str) -> set:
    out = set()
    for part in spec.split(','):
        part = part.strip()[2:]
        if '-' in part:
            a, b = part.split('-')
            out |= set(range(int(a, 16), int(b, 16) + 1))
        elif part:
            out.add(int(part, 16))
    return out


def to_ranges(cps) -> str:
    cps = sorted(cps)
    parts, start, prev = [], cps[0], cps[0]
    for c in cps[1:] + [None]:
        if c is not None and c == prev + 1:
            prev = c
            continue
        parts.append(f'U+{start:x}' if start == prev else f'U+{start:x}-{prev:x}')
        if c is not None:
            start = prev = c
    return ','.join(parts)


def check() -> int:
    if not OUT_CSS.is_file():
        print('missing', OUT_CSS.relative_to(root), '— run python3 scripts/subset-fonts.py')
        return 1
    have = set()
    for rng in re.findall(r'unicode-range:\s*([^;}]+)', OUT_CSS.read_text(encoding='utf8')):
        have |= parse_ranges(rng)
    want = set().union(*groups().values())
    # Only text the font can draw matters; emoji and variation selectors use the system fonts.
    new = [c for c in want - have if 0x3400 <= c < 0x1F000 and not 0xFE00 <= c <= 0xFE0F]
    if new and SOURCE.is_file():
        from fontTools.ttLib import TTFont
        cmap = TTFont(SOURCE).getBestCmap()
        new = [c for c in new if c in cmap]  # characters the font has no glyph for cannot be added anyway
    new = sorted(new)
    if new:
        print('STALE font subset — run python3 scripts/subset-fonts.py. New characters:', ''.join(map(chr, new)))
        return 1
    print(f'font subset ok: {len(have)} code points')
    return 0


def build() -> int:
    from fontTools import subset
    from fontTools.ttLib import TTFont
    if not SOURCE.is_file():
        print('missing source font', SOURCE.relative_to(root))
        return 1
    cmap = TTFont(SOURCE).getBestCmap()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    rules, total, missing = [], 0, set()
    for name, cps in groups().items():
        keep = {c for c in cps if c in cmap}
        missing |= cps - keep
        if not keep:
            continue
        font = TTFont(SOURCE)
        opts = subset.Options()
        opts.flavor = 'woff2'
        opts.layout_features = ['*']
        opts.name_IDs = ['*']
        opts.recalc_timestamp = False  # same text → same bytes → same file name
        sub = subset.Subsetter(opts)
        sub.populate(unicodes=keep)
        sub.subset(font)
        tmp = OUT_DIR / f'{name}.tmp'
        font.flavor = 'woff2'
        font.recalcTimestamp = False
        font.save(tmp)
        # Content hash in the file name: the asset service worker caches by path, so changed text gets a new URL at once.
        digest = hashlib.sha256(tmp.read_bytes()).hexdigest()[:10]
        out = OUT_DIR / f'{name}-{digest}.woff2'
        for old in OUT_DIR.glob(f'{name}-*.woff2'):
            if old != out:
                old.unlink()
        tmp.replace(out)
        size = out.stat().st_size
        total += size
        print(f'  {out.relative_to(root)}: {len(keep)} glyphs, {size / 1024:.0f} KB')
        rules.append("@font-face{font-family:'Noto Serif TC';font-style:normal;font-display:swap;font-weight:200 900;"
                     f"src:url(../../../assets/fonts/noto-serif-tc-game/{out.name}) format('woff2');unicode-range:{to_ranges(keep)};}}")
    header = '/* Generated by scripts/subset-fonts.py — Noto Serif TC cut to the characters the game uses. Do not edit. */\n'
    OUT_CSS.write_text(header + '\n'.join(rules) + '\n', encoding='utf8')
    print(f'total {total / 1024:.0f} KB')
    shown = sorted(c for c in missing if 0x3400 <= c < 0x1F000 and not 0xFE00 <= c <= 0xFE0F)
    if shown:
        print('No glyph in Noto Serif TC (system font is used):', ''.join(map(chr, shown)))
    return 0


if __name__ == '__main__':
    sys.exit(check() if '--check' in sys.argv else build())
