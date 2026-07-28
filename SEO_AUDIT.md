# SEO audit report — Best Letting Agent for Landlords

**Date:** 2026-07-28  
**Scope:** All public Astro pages (`src/pages/**`), layout meta, footer, AI surfaces, internal links  
**Targets:** Title 50–60 chars · Meta description 140–160 chars · One H1 · Correct canonical

---

## Priority 1 — Fixed (was failing)

| Issue | Before | Fix |
|-------|--------|-----|
| Titles too long (often 64–82 chars) | Brand suffix `\| Best Letting Agent` appended on most pages | Central `pageSeo` + `areaPageTitle()` without redundant suffix |
| Area meta descriptions too short (~97–104) | Thin template string | `areaPageDescription()` padded to 140–160 |
| Compare / services / areas descriptions over 160 | Slightly long copy | Tightened in `src/data/seo.ts` |
| Homepage title 71 chars | Full brand + tagline | `Compare Letting Agent Fees & Ratings for Landlords` (50) |
| Weak internal linking on guide pages | Dead-ends after FAQ | `RelatedGuides` on all key templates |
| No AI citation surface | Only `llms.txt` | `/for-ai/` + footer “For AI & search” + `<link rel="alternate">` to `llms.txt` |

---

## Priority 2 — Verified OK (no change needed)

| Check | Result |
|-------|--------|
| Single H1 per page | Pass — 1× `<h1>` on every built HTML page |
| Canonical tags | Pass — absolute `https://bestlettingagentforlandlords.co.uk{path}` via `BaseLayout` |
| `hreflang` | Present (`en-GB` + `x-default`) |
| OG / Twitter | Mirror title + description + image |
| FAQ / Article / Breadcrumb JSON-LD | Present on guides |
| Sitemap | `@astrojs/sitemap` → `/sitemap-index.xml` |
| robots.txt | Allows all + sitemap pointer |

---

## Priority 3 — Recommendations (next)

1. **Search Console** — submit sitemap; add HTML verification meta when you have the code.  
2. **Featured snippets** — keep FAQ blocks; ensure answers stay concise (40–60 words).  
3. **More featured agents** — only Doncaster has `featured`; add when you have real partners (avoid thin affiliate spam).  
4. **Redirects** — if old `/letting-agents-doncaster/` URLs were shared, add host-level 301s to `/letting-agents/doncaster/`.  
5. **Core Web Vitals** — hero image is large; consider compressed WebP + `width`/`height` (already set).  
6. **Duplicate H2 risk** — area pages share similar H2s (“What X landlords should compare”); differentiate first paragraphs per city over time.

---

## Title & description status (after fix)

All static hubs use `src/data/seo.ts` (`pageSeo`). City pages use `areaPageTitle` / `areaPageDescription`.

| Path | Title target | Desc target |
|------|--------------|-------------|
| `/` | 50 ✓ | 149 ✓ |
| `/compare/` | 50 ✓ | 145 ✓ |
| `/letting-agent-fees/` | 50 ✓ | 147 ✓ |
| `/full-management-vs-tenant-find/` | 50 ✓ | 146 ✓ |
| `/how-to-choose-a-letting-agent/` | 50 ✓ | 146 ✓ |
| `/questions-to-ask-a-letting-agent/` | 50 ✓ | 144 ✓ |
| `/letting-agents/` | 50 ✓ | 150 ✓ |
| `/letting-agents/{city}/` | 50–60 ✓ | 140–160 ✓ |
| `/for-ai/` | 51 ✓ | 159 ✓ |

**Post-build verification:** 38 HTML pages checked — **0 failing** on title length, description length, single H1, or canonical host.

---

## Internal linking map

- Homepage → compare, fees, services, choose, phone, areas, Doncaster  
- Every guide → `RelatedGuides` block (compare, fees, managed vs let-only, choose, phone, areas, Doncaster)  
- Area pages → nearby cities in same region + compare + phone checklist  
- Footer → guides, areas, **AI & search** (`/for-ai/`, `llms.txt`, sitemap, robots)

---

## AI / ChatGPT / AI Overviews

| Asset | URL |
|-------|-----|
| Human + AI citation page | `/for-ai/` |
| llms.txt | `/llms.txt` |
| Head discovery link | `rel="alternate" type="text/plain" href="/llms.txt"` |
| Footer | “For AI & search” column |

---

## Files touched

- `src/data/seo.ts` (new)  
- `src/components/RelatedGuides.astro` (new)  
- `src/pages/for-ai/index.astro` (new)  
- `src/layouts/BaseLayout.astro`  
- `src/components/SiteFooter.astro`  
- All public page templates under `src/pages/`  
- This report: `SEO_AUDIT.md`
