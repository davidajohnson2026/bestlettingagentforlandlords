#!/usr/bin/env node
/**
 * Post-build SEO sanity check for Google / crawlers.
 * Titles 50–60, descriptions 140–160, single H1, canonical host.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url);
const HOST = 'https://bestlettingagentforlandlords.co.uk';
const failures = [];

async function walkHtml(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) files.push(...(await walkHtml(full)));
		else if (entry.name.endsWith('.html')) files.push(full);
	}
	return files;
}

function extract(html, re) {
	const m = html.match(re);
	return m?.[1]?.trim() ?? null;
}

const files = await walkHtml(DIST.pathname);
for (const file of files) {
	const html = await readFile(file, 'utf8');
	const rel = file.replace(DIST.pathname, '');
	const title = extract(html, /<title>([^<]*)<\/title>/i);
	const desc = extract(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
	const canonical = extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
	const h1s = [...html.matchAll(/<h1\b[^>]*>/gi)];
	const noindex = /noindex/i.test(extract(html, /<meta\s+name="robots"\s+content="([^"]*)"/i) || '');

	if (h1s.length !== 1) {
		failures.push(`${rel}: expected 1 H1, found ${h1s.length}`);
	}
	if (!canonical?.startsWith(HOST)) {
		failures.push(`${rel}: bad canonical ${canonical}`);
	}

	// Thank-you / utility pages can be noindex — skip strict SERP length rules
	if (noindex) continue;

	if (!title || title.length < 50 || title.length > 60) {
		failures.push(`${rel}: title length ${title?.length ?? 0} (need 50–60) — ${title}`);
	}
	if (!desc || desc.length < 140 || desc.length > 160) {
		failures.push(`${rel}: description length ${desc?.length ?? 0} (need 140–160)`);
	}
}

// Compare page must ship crawlable featured links + FAQ schema in HTML
const compareHtml = await readFile(join(DIST.pathname, 'compare/index.html'), 'utf8');
for (const needle of [
	'/letting-agents/doncaster/',
	'/letting-agents/sheffield/',
	'/letting-agents/rotherham/',
	'Henry Spencer',
	'Bricknells',
	'FAQPage',
	'ItemList',
	'WebApplication',
	'Organization',
	'WebSite',
]) {
	if (!compareHtml.includes(needle)) {
		failures.push(`compare/: missing crawl signal "${needle}"`);
	}
}

// Every indexable page must include Organization + WebSite (via BaseLayout)
for (const file of files) {
	const html = await readFile(file, 'utf8');
	const rel = file.replace(DIST.pathname, '');
	const noindex = /noindex/i.test(extract(html, /<meta\s+name="robots"\s+content="([^"]*)"/i) || '');
	if (noindex) continue;
	if (!html.includes('"@type":"Organization"') && !html.includes('"@type": "Organization"')) {
		failures.push(`${rel}: missing Organization JSON-LD`);
	}
	if (!html.includes('"@type":"WebSite"') && !html.includes('"@type": "WebSite"')) {
		failures.push(`${rel}: missing WebSite JSON-LD`);
	}
}

if (failures.length) {
	console.error(`SEO check failed (${failures.length}):\n` + failures.map((f) => ` - ${f}`).join('\n'));
	process.exit(1);
}

// Noindex pages must not appear in the XML sitemap
const sitemap = await readFile(join(DIST.pathname, 'sitemap-0.xml'), 'utf8');
if (sitemap.includes('/recommend/thanks')) {
	console.error('SEO check failed: noindex /recommend/thanks/ is still in sitemap-0.xml');
	process.exit(1);
}

console.log(`SEO check passed: ${files.length} HTML pages, compare crawl signals OK.`);
