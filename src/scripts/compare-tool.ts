import { areas, areaPath } from '../data/areas';
import { matchArea } from '../data/matchArea';
import { isWithinKerrigansRadius } from '../data/recommendations';

const SERVICE_LABELS: Record<string, string> = {
	full: 'Full management',
	'tenant-find': 'Tenant find only',
	'rent-collect': 'Rent collection',
};

type FeaturedPayload = {
	name: string;
	url: string;
	phone: string;
	phoneHref: string;
	summary: string;
	reputationNote: string;
};

type AreaPayload = {
	slug: string;
	name: string;
	region: string;
	nation: string;
	prefixes: string[];
	districts: string[];
	feeNote: string;
	blurb: string;
	path: string;
	featured: FeaturedPayload | null;
};

function buildPayload(): AreaPayload[] {
	return areas.map((area) => ({
		slug: area.slug,
		name: area.name,
		region: area.region,
		nation: area.nation,
		prefixes: area.prefixes,
		districts: area.districts ?? [],
		feeNote: area.feeNote,
		blurb: area.blurb,
		path: areaPath(area.slug),
		featured: area.featured
			? {
					name: area.featured.name,
					url: area.featured.url,
					phone: area.featured.phone,
					phoneHref: area.featured.phoneHref,
					summary: area.featured.summary,
					reputationNote: area.featured.reputationNote ?? '',
				}
			: null,
	}));
}

function setText(root: Element | null, selector: string, value: string) {
	const el = root?.querySelector(selector);
	if (el) el.textContent = value;
}

export function initCompareTool() {
	const list = buildPayload();
	const params = new URLSearchParams(window.location.search);
	const postcodeInput = document.getElementById('postcode');
	const serviceSelect = document.getElementById('service');
	const results = document.getElementById('compare-results');
	const localRoute = document.querySelector('[data-local-route]');
	const defaultRec = document.querySelector('[data-default-rec]');
	const featuredBox = document.querySelector('[data-local-featured]');
	const noFeatured = document.querySelector('[data-no-featured]');

	function showFeatured(agent: FeaturedPayload | null) {
		if (!featuredBox || !agent) {
			featuredBox?.setAttribute('hidden', '');
			noFeatured?.removeAttribute('hidden');
			return;
		}
		featuredBox.removeAttribute('hidden');
		noFeatured?.setAttribute('hidden', '');
		setText(featuredBox, '[data-featured-name]', agent.name);
		setText(featuredBox, '[data-featured-summary]', agent.summary);
		setText(featuredBox, '[data-featured-rep]', agent.reputationNote);
		const phone = featuredBox.querySelector('[data-featured-phone]');
		const site = featuredBox.querySelector('[data-featured-url]');
		if (phone instanceof HTMLAnchorElement) {
			phone.href = agent.phoneHref;
			phone.textContent = `Call ${agent.phone}`;
		}
		if (site instanceof HTMLAnchorElement) site.href = agent.url;
	}

	function showResults() {
		const postcode = params.get('postcode') || '';
		const service = params.get('service') || 'full';
		const areaSlug = params.get('area');

		if (postcodeInput instanceof HTMLInputElement && postcode) postcodeInput.value = postcode;
		if (serviceSelect instanceof HTMLSelectElement) serviceSelect.value = service;
		if (!postcode && !areaSlug) return;

		results?.removeAttribute('hidden');

		let area = areaSlug ? list.find((item) => item.slug === areaSlug) : null;
		if (!area && postcode) {
			const matched = matchArea(postcode);
			area = matched ? list.find((item) => item.slug === matched.slug) ?? null : null;
		}

		const kerrigansOk = postcode ? isWithinKerrigansRadius(postcode) : areaSlug === 'doncaster';
		const serviceLabel = SERVICE_LABELS[service] || service;

		if (area?.slug === 'doncaster' && postcode && !kerrigansOk) {
			localRoute?.setAttribute('hidden', '');
			defaultRec?.removeAttribute('hidden');
			setText(defaultRec, '[data-service-label-default]', serviceLabel);
			const note = defaultRec?.querySelector('[data-other-area-note]');
			if (note instanceof HTMLElement) {
				note.hidden = false;
				note.textContent =
					'That DN postcode looks outside our ~9-mile Doncaster radius for Kerrigans. Compare regulated local agents near you instead of a Doncaster-only recommendation.';
			}
			return;
		}

		if (area?.featured && localRoute && defaultRec) {
			localRoute.removeAttribute('hidden');
			defaultRec.setAttribute('hidden', '');
			setText(localRoute, '[data-local-name]', area.name);
			setText(localRoute, '[data-local-region]', area.region);
			setText(localRoute, '[data-local-nation]', area.nation);
			setText(localRoute, '[data-local-blurb]', area.blurb);
			setText(localRoute, '[data-local-fee]', area.feeNote);
			setText(localRoute, '[data-service-label-local]', serviceLabel);
			const guide = localRoute.querySelector('[data-local-guide]');
			if (guide instanceof HTMLAnchorElement) guide.href = area.path;
			showFeatured(area.featured);
			return;
		}

		localRoute?.setAttribute('hidden', '');
		defaultRec?.removeAttribute('hidden');
		setText(defaultRec, '[data-service-label-default]', serviceLabel);
		const otherNote = defaultRec?.querySelector('[data-other-area-note]');
		if (otherNote instanceof HTMLElement) {
			if (area) {
				otherNote.hidden = false;
				otherNote.replaceChildren();
				otherNote.append('Your postcode looks like ');
				const strong = document.createElement('strong');
				strong.textContent = area.name;
				otherNote.append(strong);
				otherNote.append('. Read the ');
				const link = document.createElement('a');
				link.href = area.path;
				link.textContent = `${area.name} area guide`;
				otherNote.append(link);
				otherNote.append(
					area.featured
						? ` — featured locally: ${area.featured.name}.`
						: ' and shortlist regulated agents near you.',
				);
			} else {
				otherNote.hidden = true;
				otherNote.textContent = '';
			}
		}
	}

	showResults();
}

if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initCompareTool);
	} else {
		initCompareTool();
	}
}
