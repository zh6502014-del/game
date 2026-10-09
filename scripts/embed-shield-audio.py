#!/usr/bin/env python3
"""Rebuild assets/audio/story/shield-rhythm-embed.js (base64 copy of the shield-rhythm audio).
Used only when fetch() is blocked (page opened by double-click, file://). Run after changing any shield-rhythm mp3."""
import base64, glob, json, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
files = ['assets/audio/story/shield-rhythm-theme.mp3'] + sorted(glob.glob(os.path.join(root, 'assets/audio/story/shield-rhythm/*.mp3')))
files = [os.path.relpath(f, root) if os.path.isabs(f) else f for f in files]
files = [f for f in files if not f.endswith('sr-success.mp3')]  # success keeps the original synth boom
data = {f: base64.b64encode(open(os.path.join(root, f), 'rb').read()).decode() for f in files}
out = os.path.join(root, 'assets/audio/story/shield-rhythm-embed.js')
open(out, 'w').write('window.NDShieldEmbed=' + json.dumps(data) + ';\n')
print(out, os.path.getsize(out), 'bytes,', len(data), 'files')
