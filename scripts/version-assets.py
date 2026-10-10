"""Run after JS/CSS changes: rebuilds the CSS bundles, then content-versions every local JS/CSS reference.

Content versions prevent mixing cached UI releases. The CSS modules under src/css/ are the source;
pages load the generated bundles in src/css/dist/ (see scripts/build-css.py and src/css/README.md).
"""
from pathlib import Path
import hashlib
import re
import subprocess
import sys

root = Path(__file__).resolve().parent.parent
subprocess.run([sys.executable, str(root / 'scripts' / 'build-css.py')], check=True)
pattern = re.compile(r'((?:src|href)=[\"\'])([^\"\'?]+\.(?:css|js))(?:\?[^\"\']*)?([\"\'])')
for page in root.glob('*.html'):
    def version(match):
        resource = root / match[2]
        if not resource.is_file():
            return match[0]
        digest = hashlib.sha256(resource.read_bytes()).hexdigest()[:12]
        return f'{match[1]}{match[2]}?v={digest}{match[3]}'
    original = page.read_text()
    updated = pattern.sub(version, original)
    if updated != original:
        page.write_text(updated)
        print(page.name)
