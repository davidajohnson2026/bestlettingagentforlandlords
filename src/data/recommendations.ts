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

export function getDistrictCode(postcode: string): string | null {
	const cleaned = postcode.toUpperCase().replace(/[^A-Z0-9]/g, '');
	const match = cleaned.match(/^([A-Z]{1,2}\d{1,2})/);
	return match?.[1] ?? null;
}

export function getPostalAreaCode(postcode: string): string | null {
	const cleaned = postcode.toUpperCase().replace(/[^A-Z0-9]/g, '');
	const match = cleaned.match(/^([A-Z]{1,2})\d/);
	return match?.[1] ?? null;
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

export const kerrigansFeatured: FeaturedAgent = {
	name: 'Kerrigans Property',
	url: 'https://kerrigans.co.uk/lettings/',
	phone: '01302 769276',
	phoneHref: 'tel:+441302769276',
	summary:
		'Family-run since 1978, ARLA Propertymark registered, offering tenant find through to full management across Doncaster and the local area (about a 9-mile radius).',
	highlights: [
		'45+ years letting experience across Doncaster',
		'Tenant find, rent collection & full management',
		'ARLA Propertymark & The Property Ombudsman',
		'Covers Doncaster + ~9 mile radius (not Sheffield/Rotherham town centres)',
		'Free, no-obligation rental valuations',
	],
	reputationNote:
		'Long-established Doncaster independent with ARLA Propertymark membership and The Property Ombudsman.',
};

export const henrySpencerFeatured: FeaturedAgent = {
	name: 'Henry Spencer & Sons',
	url: 'https://www.hss-lettings.co.uk/',
	phone: '0114 229 6410',
	phoneHref: 'tel:+441142296410',
	summary:
		'Independent Sheffield letting specialists. ARLA-qualified team, registered with The Property Ombudsman, focused on transparent landlord service across Sheffield.',
	highlights: [
		'ARLA Propertymark qualified lettings team',
		'Independent Sheffield agent with strong local focus',
		'The Property Ombudsman redress membership',
		'Tenant find through to managed options',
	],
	reputationNote:
		'ARLA-qualified independent Sheffield firm with The Property Ombudsman membership — a fair local alternative to national brands.',
};

export const bricknellsFeatured: FeaturedAgent = {
	name: 'Bricknells Rentals',
	url: 'https://www.bricknells-rentals.co.uk/landlords/',
	phone: '01709 365584',
	phoneHref: 'tel:+441709365584',
	summary:
		'Rotherham-focused independent letting agency. ARLA licensed, Client Money Protection, and consistently strong landlord review scores on major review platforms.',
	highlights: [
		'ARLA licensed with Client Money Protection',
		'Strong allAgents review profile (high recommend rate)',
		'Large local managed portfolio experience',
		'Let-only and fully managed options for landlords',
	],
	reputationNote:
		'Widely reviewed Rotherham independent (ARLA / CMP) often cited among top-rated local letting agents — recommended here instead of Doncaster agents for fairness.',
};
