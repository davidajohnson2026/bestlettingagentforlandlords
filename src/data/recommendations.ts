/**
 * Featured-agent fairness rules.
 * Kerrigans: Doncaster urban area + ~9 mile radius only (selected DN districts).
 * Sheffield / Rotherham: separate local recommendations — not Kerrigans.
 */

export type FeaturedAgent = {
	name: string;
	url: string;
	phone: string;
	phoneHref: string;
	summary: string;
	highlights: string[];
	/** Shown when recommending this agent */
	reputationNote?: string;
};

/** DN districts roughly within ~9 miles of Doncaster town centre */
export const KERRIGANS_RADIUS_DISTRICTS = [
	'DN1',
	'DN2',
	'DN3',
	'DN4',
	'DN5',
	'DN6',
	'DN7',
	'DN9', // Hatfield / Finningley corridor
	'DN11', // Tickhill side of Doncaster
	'DN12', // Conisbrough / Edlington (~5–7 miles)
] as const;

/** DN districts generally beyond ~9 miles (e.g. Thorne, Goole, Scunthorpe, Retford) */
export const KERRIGANS_OUTSIDE_DISTRICTS = [
	'DN8',
	'DN10',
	'DN14',
	'DN15',
	'DN16',
	'DN17',
	'DN18',
	'DN19',
	'DN20',
	'DN21',
	'DN22',
] as const;

/**
 * Normalise a UK postcode to A–Z / 0–9 only.
 * Outward code is everything before the inward unit (always last 3 chars when complete).
 */
export function cleanPostcode(postcode: string): string {
	return postcode.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * UK outward district without sector letter (e.g. DN2, DN11, S1, S60, EC1).
 * Complete postcodes: strip the inward 3 characters first so DN2 1AA → DN2, not DN21.
 */
export function getDistrictCode(postcode: string): string | null {
	const cleaned = cleanPostcode(postcode);
	if (!cleaned) return null;

	const outward = cleaned.length >= 5 ? cleaned.slice(0, -3) : cleaned;
	const match = outward.match(/^([A-Z]{1,2}\d{1,2})[A-Z]?$/);
	return match?.[1] ?? null;
}

export function getPostalAreaCode(postcode: string): string | null {
	const cleaned = cleanPostcode(postcode);
	if (!cleaned) return null;

	const outward = cleaned.length >= 5 ? cleaned.slice(0, -3) : cleaned;
	const withDigit = outward.match(/^([A-Z]{1,2})\d/);
	if (withDigit) return withDigit[1];
	// Bare area only (e.g. "DN") — used for incomplete compare input
	const bare = outward.match(/^([A-Z]{1,2})$/);
	return bare?.[1] ?? null;
}

/** True only for Doncaster-area postcodes inside the Kerrigans ~9 mile coverage. */
export function isWithinKerrigansRadius(postcode: string): boolean {
	const district = getDistrictCode(postcode);
	if (district) {
		if ((KERRIGANS_OUTSIDE_DISTRICTS as readonly string[]).includes(district)) return false;
		if ((KERRIGANS_RADIUS_DISTRICTS as readonly string[]).includes(district)) return true;
	}
	// Bare "DN" / incomplete — treat as Doncaster enquiry, show Kerrigans with radius note
	const area = getPostalAreaCode(postcode);
	return area === 'DN' && !district;
}

export const henrySpencerFeatured: FeaturedAgent = {
	name: 'Henry Spencer & Sons',
	url: 'https://www.hss-lettings.co.uk/',
	phone: '0114 229 6410',
	phoneHref: 'tel:+441142296410',
	summary:
		'Sheffield lettings listing. Check current professional memberships, redress registration, written fees and recent landlord references before instructing.',
	highlights: [
		'Check current professional membership',
		'Ask about recent lets in your postcode',
		'Verify redress and client-money protection',
		'Confirm the available service and full written fees',
	],
	reputationNote:
		'An editorial listing, not verification of accreditation, review scores or service quality.',
};

export const bricknellsFeatured: FeaturedAgent = {
	name: 'Bricknells Rentals',
	url: 'https://www.bricknells-rentals.co.uk/landlords/',
	phone: '01709 365584',
	phoneHref: 'tel:+441709365584',
	summary:
		'Rotherham lettings listing. Verify current professional memberships, client-money protection, redress registration and written terms directly.',
	highlights: [
		'Verify current accreditation and money protection',
		'Read recent detailed landlord reviews',
		'Ask about comparable properties in your postcode',
		'Confirm service options and a complete written quote',
	],
	reputationNote:
		'An editorial listing, not a verified ranking, accreditation or performance endorsement.',
};
