import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
const decode = value => value.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n))).replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&apos;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const text = value => decode(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(m => [m[1].toLowerCase(), decode(m[2] ?? m[3] ?? m[4])]));
}
async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(path));
    else if (entry.name.endsWith('.html')) result.push(path);
  }
  return result;
}
export function eligiblePage(html, url) {
  const tags = [...html.matchAll(/<(?:meta|link)\b[^>]*>/gi)].map(m => attributes(m[0]));
  const canonicals = tags.filter(a => a.rel?.toLowerCase() === 'canonical').map(a => a.href);
  if (canonicals.length !== 1 || canonicals[0] !== url) return false;
  return !tags.some(a => (['robots', 'googlebot'].includes(a.name?.toLowerCase()) && /\b(?:noindex|none)\b/i.test(a.content ?? '')) || a['http-equiv']?.toLowerCase() === 'refresh');
}
export async function generateSitemaps(directory, options) {
  const { site, xmlFile = 'sitemap.xml', htmlPath = '/site-map/', html = true, exclude = [], htmlExclude = [], groups = [], frozen = {} } = options;
  const origin = new URL(site).origin;
  const pages = [];
  for (const file of await files(directory)) {
    const name = relative(directory, file).split('\\').join('/');
    const path = '/' + (name.endsWith('index.html') ? name.slice(0, -10) : name);
    if (path === htmlPath || exclude.some(prefix => path === prefix || (prefix.endsWith('/') && path.startsWith(prefix)))) continue;
    const body = await readFile(file, 'utf8');
    const url = new URL(path, origin).href;
    if (!eligiblePage(body, url)) continue;
    const heading = body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? body.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
    if (!heading) throw new Error(`Sitemap page has no descriptive title: ${path}`);
    pages.push({ path, url, title: text(heading) });
  }
  pages.sort((a, b) => a.path.localeCompare(b.path, 'en'));
  const preview = options.preview === true;
  if (html) {
    const visible = pages.filter(p => !htmlExclude.some(prefix => p.path === prefix || (prefix.endsWith('/') && p.path.startsWith(prefix))));
    const grouped = new Map();
    for (const page of visible) {
      const label = groups.find(group => group.prefixes.some(prefix => prefix === '/' ? page.path === '/' : page.path.startsWith(prefix)))?.title ?? options.fallbackGroup ?? 'Other public pages';
      if (!grouped.has(label)) grouped.set(label, []);
      grouped.get(label).push(page);
    }
    const sections = [...grouped].map(([label, entries]) => `<section><h2>${escape(label)}</h2><ul>${entries.sort((a,b) => a.title.localeCompare(b.title,'en')).map(p => `<li><a href="${escape(p.path)}">${escape(p.title)}</a></li>`).join('')}</ul></section>`).join('\n');
    const htmlTitle = options.htmlTitle ?? `Site map | ${options.name}`;
    const htmlDescription = options.htmlDescription ?? `Browse ${options.name} pages by topic.`;
    const home = await readFile(join(directory, 'index.html'), 'utf8');
    const schema = [];
    for (const match of home.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try {
        const data = JSON.parse(match[1]);
        const nodes = Array.isArray(data) ? data : data['@graph'] ?? [data];
        schema.push(...nodes.filter(node => ['Organization', 'WebSite'].includes(node['@type'])));
      } catch { /* Unrelated invalid markup is checked by the site's own validators. */ }
    }
    const schemaHtml = schema.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': schema }).replaceAll('<', '\\u003c')}</script>` : '';
    const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(htmlTitle)}</title><meta name="description" content="${escape(htmlDescription)}">${schemaHtml}<link rel="canonical" href="${escape(origin + htmlPath)}">${preview ? '<meta name="robots" content="noindex, nofollow">' : ''}<style>body{margin:0;background:#faf9f6;color:#202b32;font:1rem/1.6 system-ui,sans-serif}main,header,footer{max-width:76rem;margin:auto;padding:1.5rem}header,footer{border-block-end:1px solid #d4d8d8}h1{font-size:clamp(2rem,5vw,3.5rem);line-height:1.15}h2{font-size:1.2rem}nav{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,21rem),1fr));gap:2rem}section{break-inside:avoid}ul{padding-left:1.25rem}li{margin:.5rem 0}a{color:#184e65;text-underline-offset:.2em}a:focus-visible{outline:3px solid #d47a2b;outline-offset:4px}</style></head><body><header><a href="/">${escape(options.name)} — home</a></header><main><h1>Site map</h1><p>Browse our public pages by topic.</p><nav aria-label="Site map pages" data-sitemap-list>${sections}</nav></main><footer><a href="/">Return to home</a></footer></body></html>`;
    const target = join(directory, htmlPath.slice(1), 'index.html');
    await mkdir(join(directory, htmlPath.slice(1)), { recursive: true });
    await writeFile(target, body);
    if (!preview) pages.push({ path: htmlPath, url: origin + htmlPath, title: 'Site map' });
  }
  // Preview builds advertise no pages, even when their canonicals point at production.
  const indexable = preview ? [] : pages;
  if (!preview) for (const path of options.requiredPaths ?? ['/']) {
    if (!indexable.some(p => p.path === path)) throw new Error(`Required public sitemap URL disappeared: ${path}`);
  }
  if (indexable.length > 50000) throw new Error('Split the sitemap before exceeding 50,000 URLs');
  for (const path of Object.keys(frozen)) {
    if (!indexable.some(p => p.path === path)) throw new Error(`Protected sitemap URL disappeared: ${path}`);
  }
  // Unverified site-wide/build dates are intentionally omitted. Frozen experiment
  // entries retain their exact pre-change XML, including dates and optional tags.
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map(p => frozen[p.path] ?? `  <url><loc>${escape(p.url)}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile(join(directory, xmlFile), xml);
  return indexable;
}
export default function sitemapBuild(options) {
  return { name: 'verified-public-sitemaps', hooks: {
    'astro:build:done': async ({ dir }) => { await generateSitemaps(fileURLToPath(dir), options); },
  } };
}
