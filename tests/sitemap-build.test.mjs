import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateSitemaps } from '../integrations/sitemap-build.mjs';

test('content additions/removals update both maps and indexing exclusions remain enforced', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'sitemap-regression-'));
  const options = { site: 'https://example.com', name: 'Example', exclude: ['/private/'], htmlExclude: ['/protected/'], groups: [{ title: 'Guides', prefixes: ['/guides/'] }] };
  async function page(path, title, extra = '', canonical = `https://example.com${path}`) {
    await mkdir(join(dir, path), { recursive: true });
    await writeFile(join(dir, path, 'index.html'), `<html><head><link href='${canonical}' rel='canonical'>${extra}</head><body><h1>${title}</h1></body></html>`);
  }
  try {
    await page('/', 'Home'); await page('/guides/one/', 'One &amp; two');
    await page('/noindex/', 'No index', '<meta content="noindex, follow" name="robots">');
    await page('/bot-noindex/', 'Googlebot no index', '<meta name="googlebot" content="none">');
    await page('/double-canonical/', 'Ambiguous', '<link rel="canonical" href="https://example.com/double-canonical/">');
    await page('/duplicate/', 'Duplicate', '', 'https://example.com/guides/one/');
    await page('/preview/', 'Wrong host', '', 'https://preview.example.com/preview/');
    await page('/redirect/', 'Redirect', '<meta http-equiv="refresh" content="0;url=/">');
    await page('/private/secret/', 'Private'); await page('/protected/', 'Protected');
    await generateSitemaps(dir, options);
    const xml = await readFile(join(dir, 'sitemap.xml'), 'utf8');
    const html = await readFile(join(dir, 'site-map/index.html'), 'utf8');
    assert.match(xml, /https:\/\/example.com\/protected\//);
    assert.match(html, /<h2>Guides<\/h2>/); assert.match(html, /One &amp; two/);
    for (const path of ['noindex', 'bot-noindex', 'double-canonical', 'duplicate', 'preview', 'redirect', 'private']) assert.ok(!xml.includes(`/${path}/`), path);
    assert.ok(!html.includes('href="/protected/"'));
    assert.ok(!xml.includes('<lastmod>')); assert.ok(!xml.includes('<priority>')); assert.ok(!xml.includes('<changefreq>'));
    await page('/guides/new/', 'New guide'); await generateSitemaps(dir, options);
    assert.match(await readFile(join(dir, 'sitemap.xml'), 'utf8'), /\/guides\/new\//);
    assert.match(await readFile(join(dir, 'site-map/index.html'), 'utf8'), /href="\/guides\/new\/"/);
    await rm(join(dir, 'guides/new'), { recursive: true }); await generateSitemaps(dir, options);
    assert.ok(!(await readFile(join(dir, 'sitemap.xml'), 'utf8')).includes('/guides/new/'));
    assert.ok(!(await readFile(join(dir, 'site-map/index.html'), 'utf8')).includes('/guides/new/'));
    await page('/guides/one/', 'Updated advice'); await generateSitemaps(dir, options);
    const updated = await readFile(join(dir, 'site-map/index.html'), 'utf8');
    assert.match(updated, /Updated advice/); assert.ok(!updated.includes('One &amp; two'));
    await generateSitemaps(dir, { ...options, preview: true });
    assert.ok(!(await readFile(join(dir, 'sitemap.xml'), 'utf8')).includes('<url>'));
    assert.match(await readFile(join(dir, 'site-map/index.html'), 'utf8'), /noindex, nofollow/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('frozen XML metadata is byte-preserved and missing protected URLs fail the build', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'sitemap-frozen-'));
  try {
    await writeFile(join(dir, 'index.html'), '<link rel="canonical" href="https://example.com/"><h1>Home</h1>');
    const node = '<url><loc>https://example.com/</loc><lastmod>2026-08-10</lastmod><priority>0.8</priority></url>';
    await generateSitemaps(dir, { site: 'https://example.com', name: 'Example', frozen: { '/': node } });
    assert.ok((await readFile(join(dir, 'sitemap.xml'), 'utf8')).includes(node));
    await assert.rejects(generateSitemaps(dir, { site: 'https://example.com', frozen: { '/missing/': node } }), /Protected sitemap URL disappeared/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
