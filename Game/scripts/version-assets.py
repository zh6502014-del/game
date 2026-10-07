"""Run after JS/CSS changes: content versions prevent mixing cached UI releases."""
from pathlib import Path
import hashlib
import re

root = Path(__file__).resolve().parent.parent
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
