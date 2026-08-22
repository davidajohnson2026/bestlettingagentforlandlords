/**
 * Canonical-host redirect. Both hosts served 200 and Search Console shows
 * Google indexing pages under each, splitting ranking signals. Canonical
 * tags point at bestlettingagentforlandlords.co.uk already; this makes it a real 301.
 * Only the named wrong host redirects, so *.pages.dev previews still work.
 */
export async function onRequest(context) {
	const url = new URL(context.request.url);

	if (url.hostname === "www.bestlettingagentforlandlords.co.uk") {
		url.hostname = "bestlettingagentforlandlords.co.uk";
		return Response.redirect(url.toString(), 301);
	}

	return context.next();
}
