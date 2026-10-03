#!/usr/bin/env python3
"""After `npx astro build`: make dist/ work from any folder (relative asset paths) and write out/ for publishing as an artifact.
With --preview, fonts are loaded from a local copy so the pages can be checked offline."""
import re, shutil, sys, pathlib
root = pathlib.Path(__file__).parent; dist = root / 'dist'; out = root / 'out'
shutil.rmtree(out, ignore_errors=True); shutil.copytree(dist, out)
for f in out.glob('*.html'):
    s = f.read_text().replace('"/assets/', '"assets/').replace('(/fonts/', '(fonts/').replace('"/fonts/', '"fonts/').replace('"/favicon.svg', '"favicon.svg')
    if '--preview' in sys.argv:
        s = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis[^>]*>', '<link rel="stylesheet" href="/fonts/preview.css">', s)
    elif f.name == 'index.html':
        # the artifact host adds its own document skeleton around the main page
        head = re.search(r'<head>(.*?)</head>', s, re.S).group(1)
        body = re.search(r'<body([^>]*)>(.*)</body>', s, re.S)
        head = re.sub(r'<meta charset[^>]*>|<meta name="viewport"[^>]*>', '', head)
        head = head.replace(" && d.hasAttribute('data-home')", '')  # the host owns the <html> tag, and this file is always the home page
        s = head + f'<div id="page"{body.group(1)}>' + body.group(2) + '</div>'
    f.write_text(s)
print('out/ ready:', len(list(out.glob('*.html'))), 'pages')
