/**
 * Side-by-side fee comparison rows for featured cities.
 * Featured agents: call for a written quote (no invented %).
 * Market bands: labelled illustrative UK/regional ranges — not named competitors.
 */

export type FeeCompareRow = {
	name: string;
	/** e.g. Featured, Market band */
	badge?: string;
	meta: string;
	letOnly: string;
	fullMgmt: string;
	/** Right-hand column — savings claim, CTA hint, or band note */
	aside: string;
	/** Highlight as top match */
	topMatch?: boolean;
	/** True = illustrative band, not a live agent */
	isReference?: boolean;
	phoneHref?: string;
	url?: string;
};

export type CityFeeCompare = {
	slug: string;
	city: string;
	postcodeHint: string;
	updatedLabel: string;
	footnote: string;
	rows: FeeCompareRow[];
};

export const cityFeeComparisons: CityFeeCompare[] = [
	{
		slug: 'doncaster',
		city: 'Doncaster',
		postcodeHint: 'DN1 · Doncaster + ~9 miles',
		updatedLabel: 'Guide fees · confirm in writing',
		footnote:
			'Kerrigans is our featured Doncaster recommendation (≈9-mile radius). Percentage bands are typical Northern England ranges for context — not live quotes from named competitors. Always get a full written schedule including VAT and extras.',
		rows: [
			{
				name: 'Kerrigans Property',
				badge: 'Featured',
				meta: 'ARLA · Doncaster independent since 1978',
				letOnly: 'Quote',
				fullMgmt: 'Quote',
				aside: 'Call for fees',
				topMatch: true,
				phoneHref: 'tel:+441302769276',
				url: 'https://kerrigans.co.uk/doncaster/landlord-services/',
			},
			{
				name: 'Typical local independent',
				badge: 'Market band',
				meta: 'South Yorkshire context',
				letOnly: '4–8%*',
				fullMgmt: '8–12%*',
				aside: 'Often clearer schedules',
				isReference: true,
			},
			{
				name: 'Typical high-street / national',
				badge: 'Market band',
				meta: 'Regional averages',
				letOnly: '8–12%*',
				fullMgmt: '12–15%*',
				aside: 'Watch stacked fees',
				isReference: true,
			},
		],
	},
	{
		slug: 'sheffield',
		city: 'Sheffield',
		postcodeHint: 'S1 · Sheffield',
		updatedLabel: 'Guide fees · confirm in writing',
		footnote:
			'Henry Spencer & Sons is our featured Sheffield recommendation — not a Doncaster agent. Market bands are illustrative. Confirm ARLA/CMP and a written fee schedule before you instruct.',
		rows: [
			{
				name: 'Henry Spencer & Sons',
				badge: 'Featured',
				meta: 'ARLA · Sheffield independent',
				letOnly: 'Quote',
				fullMgmt: 'Quote',
				aside: 'Call for fees',
				topMatch: true,
				phoneHref: 'tel:+441142296410',
				url: 'https://www.hss-lettings.co.uk/',
			},
			{
				name: 'Typical local independent',
				badge: 'Market band',
				meta: 'Sheffield / South Yorkshire',
				letOnly: '4–8%*',
				fullMgmt: '8–12%*',
				aside: 'Often clearer schedules',
				isReference: true,
			},
			{
				name: 'Typical high-street / national',
				badge: 'Market band',
				meta: 'Regional averages',
				letOnly: '8–12%*',
				fullMgmt: '12–15%*',
				aside: 'Watch stacked fees',
				isReference: true,
			},
		],
	},
	{
		slug: 'rotherham',
		city: 'Rotherham',
		postcodeHint: 'S60 · Rotherham',
		updatedLabel: 'Guide fees · confirm in writing',
		footnote:
			'Bricknells Rentals is our featured Rotherham recommendation. Kerrigans is reserved for Doncaster (~9 miles), not Rotherham town. Bands are illustrative — get written quotes.',
		rows: [
			{
				name: 'Bricknells Rentals',
				badge: 'Featured',
				meta: 'ARLA / CMP · Rotherham focus',
				letOnly: 'Quote',
				fullMgmt: 'Quote',
				aside: 'Call for fees',
				topMatch: true,
				phoneHref: 'tel:+441709365584',
				url: 'https://www.bricknells-rentals.co.uk/landlords/',
			},
			{
				name: 'Typical local independent',
				badge: 'Market band',
				meta: 'Rotherham / South Yorkshire',
				letOnly: '4–8%*',
				fullMgmt: '8–12%*',
				aside: 'Often clearer schedules',
				isReference: true,
			},
			{
				name: 'Typical high-street / national',
				badge: 'Market band',
				meta: 'Regional averages',
				letOnly: '8–12%*',
				fullMgmt: '12–15%*',
				aside: 'Watch stacked fees',
				isReference: true,
			},
		],
	},
];

export function feeCompareForSlug(slug: string): CityFeeCompare | undefined {
	return cityFeeComparisons.find((item) => item.slug === slug);
}
