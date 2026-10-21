# Verified sitemap remediation

Audit date: 21 October 2026. Draft engineering work only. No deployment, merge, account mutation, paid usage or indexing submission.

Website: https://bestlettingagentforlandlords.co.uk  
Repository: https://github.com/davidajohnson2026/bestlettingagentforlandlords  
Audited main SHA: `b263145bcdfff3906e86d5ed060fbc4f27f59b07`

## Confirmed issue and resulting behaviour

Valid live XML; 40 public pages lack a useful grouped HTML directory.

Group local agents, comparison tools and selection/fee guides without changing recommendations or referrals.

XML URLs: 40 live unique entries → 41 verified source-build entries. The new HTML map is included in the resulting count.

## Maintenance and policy

- `integrations/sitemap-build.mjs` runs after Astro has rendered routes. Public HTML must have exactly one self-canonical URL, no meta noindex/none, and no meta-refresh redirect. Explicit private, preview and experiment exclusions live in `sitemap-policy.json`. New eligible built routes appear without editing a URL list.
- Existing robots sitemap locations and plugin index filenames are retained. The integration regenerates the final URL set from actual rendered pages; native sitemap-plugin output is not the eligibility authority. The build fails if required public pages disappear or the single-file protocol limit is exceeded.
- Unsupported global/build `lastmod` values are omitted. No filesystem, build or deployment timestamps are invented as content freshness. Google ignores priority/changefreq; only frozen Trooflaw experiment entries retain these existing fields.
- HTML maps use heading-based categories and crawlable anchors, drawing descriptive labels from rendered page headings. Organization/WebSite schema is copied from the homepage when present. No third-party requests are made by the sitemap generator.
- `postbuild` runs `test:sitemaps`, so the production build command enforces the regression suite. Explicit Beauty preview builds retain their separate noindex workflow.

## Files changed

- `astro.config.mjs`
- `docs/sitemap-audit.md`
- `integrations/sitemap-build.mjs`
- `package.json`
- `scripts/check-sitemaps.py`
- `sitemap-policy.json`
- `src/components/SiteFooter.astro`
- `tests/sitemap-build.test.mjs`

## Verification

- `npm run build` — passed, including postbuild sitemap checks.
- `npm run test:sitemaps` — passed: generator mutation tests plus strict XML parsing, sitemap-index targets, canonical equality and HTML inclusion/exclusion.
- `git diff --check` — passed.
- Existing strict SEO validation and outward-postcode/radius regression checks passed; recommendations and referral configuration were not edited.

## Outstanding issues

Production must be checked again after an approved deployment; this PR has not been deployed.

## After approved deployment / GSC

- Re-fetch robots and `https://bestlettingagentforlandlords.co.uk/sitemap-index.xml`, confirm HTTP 200/XML MIME, then check the existing property's Sitemaps processing/errors and discovered count (source-build expectation: 41).
- Keep current sitemap submissions: changing contents at the same endpoint does not by itself require a new submission. Do not submit an HTML map as an XML sitemap.
- Use read-only GSC inspection to check representative newly included and intentionally excluded URLs after natural recrawl. No URL indexing requests were made. Preserve the Trooflaw experiment until its result is evaluated.

Commit uses `[CF-Pages-Skip]` to suppress branch preview deployment. No publishing workflow is added.
