import re
import os

with open('../duo_landing.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Check what is inside <div id="root">
root_pos = html.find('id="root"')
print('root_pos:', root_pos)

# Let's see the opening of root div
print(html[root_pos-20:root_pos+150])

# Let's find script tags, specifically window.__INITIAL_STATE__ or similar
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print(f'Total script tags: {len(scripts)}')

# Check the main tags inside root
# Let's inspect the HTML from root up to end of root or footer
root_content = html[root_pos:]
end_root = root_content.find('</body>')
if end_root != -1:
    root_content = root_content[:end_root]

print('Root content length:', len(root_content))

# Look for SVG tags inside root
svgs = re.findall(r'<svg[^>]*>.*?</svg>', root_content, re.DOTALL)
print(f'Total SVGs inside root: {len(svgs)}')

# Look for canvas tags
canvases = re.findall(r'<canvas[^>]*>.*?</canvas>', root_content, re.DOTALL)
print(f'Total canvas tags: {len(canvases)}')

# Look for img tags
imgs = re.findall(r'<img[^>]*>', root_content)
print(f'Total img tags: {len(imgs)}')
for img in imgs[:10]:
    print('  IMG:', img)

# Look for major sections
headers = re.findall(r'<header[^>]*>.*?</header>', root_content, re.DOTALL)
print(f'Headers: {len(headers)}')

mains = re.findall(r'<main[^>]*>.*?</main>', root_content, re.DOTALL)
print(f'Mains: {len(mains)}')

footers = re.findall(r'<footer[^>]*>.*?</footer>', root_content, re.DOTALL)
print(f'Footers: {len(footers)}')

# Let's check sections or articles inside main
if mains:
    main_text = mains[0]
    print('Main length:', len(main_text))
    sections = re.findall(r'<section[^>]*>.*?</section>', main_text, re.DOTALL)
    print('Sections inside main:', len(sections))
    # Let's print headings h1, h2, h3 inside main
    headings = re.findall(r'<(h[1-6])[^>]*>(.*?)</\1>', main_text)
    for h_tag, h_val in headings:
        # strip inner tags
        clean_val = re.sub(r'<[^>]+>', '', h_val).strip()
        print(f'  {h_tag}: {clean_val}')
