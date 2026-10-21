"""Validate built sitemap XML, canonical/indexability parity and HTML discovery."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import collections, hashlib, json, re, xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
CONFIG=json.loads((ROOT/'sitemap-policy.json').read_text())
DIST=ROOT/'dist'
NS='{http://www.sitemaps.org/schemas/sitemap/0.9}'
class Head(HTMLParser):
 def __init__(self): super().__init__(); self.c=[]; self.r=[]; self.links=[]; self.refresh=False
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='link' and a.get('rel')=='canonical': self.c.append(a.get('href'))
  if t=='meta' and a.get('name','').lower() in ('robots','googlebot'): self.r.append(a.get('content',''))
  if t=='meta' and a.get('http-equiv','').lower()=='refresh': self.refresh=True
  if t=='a' and a.get('href'): self.links.append(a['href'])
def parse(path):
 h=Head(); h.feed(path.read_text()); return h
def blocked(path, prefixes): return any(path==p or (p.endswith('/') and path.startswith(p)) for p in prefixes)
xml_path=DIST/CONFIG.get('xmlFile','sitemap.xml')
tree=ET.parse(xml_path); assert tree.getroot().tag==NS+'urlset'
urls=[e.text for e in tree.findall('.//'+NS+'loc')]; assert len(urls)==len(set(urls))
assert len(urls)<=50000 and xml_path.stat().st_size<=50*1024*1024
origin=CONFIG['site'].rstrip('/'); paths=set()
for url in urls:
 u=urlparse(url); assert u.scheme=='https' and origin==f'{u.scheme}://{u.netloc}' and not u.query and not u.fragment, url
 p=u.path; paths.add(p); f=DIST/p.lstrip('/')/ 'index.html' if p.endswith('/') else DIST/p.lstrip('/')
 assert f.exists(), url
 h=parse(f); assert h.c==[url], (url,h.c)
 assert not h.refresh and not any(re.search(r'\b(noindex|none)\b',r,re.I) for r in h.r), url
 assert not blocked(p,CONFIG.get('exclude',[])), url
for file in DIST.rglob('*.html'):
 p='/'+file.relative_to(DIST).as_posix(); p=p[:-10] if p.endswith('index.html') else p
 h=parse(file)
 if h.c==[origin+p] and not h.refresh and not any(re.search(r'\b(noindex|none)\b',r,re.I) for r in h.r) and not blocked(p,CONFIG.get('exclude',[])):
  assert p in paths, f'Eligible public canonical omitted: {p}'
for file in DIST.glob('*sitemap*.xml'):
 t=ET.parse(file)
 if t.getroot().tag==NS+'sitemapindex':
  for loc in t.findall('.//'+NS+'loc'):
   u=urlparse(loc.text); assert origin==f'{u.scheme}://{u.netloc}'
   child=DIST/u.path.lstrip('/'); assert child.exists(); assert ET.parse(child).getroot().tag==NS+'urlset'
if CONFIG.get('html',True):
 html_path=CONFIG.get('htmlPath','/site-map/'); h=parse(DIST/html_path.lstrip('/')/'index.html')
 expected=paths-{html_path}; expected={p for p in expected if not blocked(p,CONFIG.get('htmlExclude',[]))}
 actual=set(h.links)-{'/'}; assert actual==expected-{'/'}, (expected-actual,actual-expected)
 assert 'data-sitemap-list' in (DIST/html_path.lstrip('/')/'index.html').read_text()
if (ROOT/'tests/sitemap-experiment-baseline.json').exists():
 baseline=json.loads((ROOT/'tests/sitemap-experiment-baseline.json').read_text())
 assert len(baseline['targets'])==38
 for path,digest in baseline['html_hashes'].items():
  assert hashlib.sha256((DIST/path.lstrip('/')/'index.html').read_bytes()).hexdigest()==digest, f'Protected page changed: {path}'
 incoming=collections.Counter()
 for file in DIST.rglob('*.html'):
  source='/'+file.relative_to(DIST).as_posix(); source=source[:-10] if source.endswith('index.html') else source
  for href in parse(file).links:
   target=urlparse(href).path
   if target in baseline['targets']: incoming[source+' -> '+href]+=1
 assert dict(incoming)==baseline['incoming'], 'Experiment incoming links changed'
 nodes={urlparse(e.find(NS+'loc').text).path: ET.tostring(e,encoding='unicode') for e in tree.findall(NS+'url')}
 for path,raw in baseline['xml_nodes'].items(): assert nodes[path].strip()==raw.strip(), f'Protected XML changed: {path}'
print(f'PASS: {len(urls)} canonical/indexable URLs; valid XML/index and HTML inclusion/exclusion checks')
