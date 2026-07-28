import type { FeaturedAgent } from './recommendations';
import {
	bricknellsFeatured,
	getDistrictCode,
	getPostalAreaCode,
	henrySpencerFeatured,
	kerrigansFeatured,
} from './recommendations';

export type { FeaturedAgent };
export { getDistrictCode as getDistrict, getPostalAreaCode as getPostalArea };

export type Area = {
	slug: string;
	name: string;
	region: string;
	nation: 'England' | 'Scotland' | 'Wales' | 'Northern Ireland';
	/** UK postal area codes, e.g. DN, M, EH */
	prefixes: string[];
	/** Optional finer match, e.g. S60 for Rotherham within S */
	districts?: string[];
	feeNote: string;
	blurb: string;
	featured?: FeaturedAgent;
};

export const areas: Area[] = [
	{
		slug: 'london',
		name: 'London',
		region: 'London',
		nation: 'England',
		prefixes: ['E', 'EC', 'N', 'NW', 'SE', 'SW', 'W', 'WC', 'BR', 'CR', 'DA', 'EN', 'HA', 'IG', 'KT', 'RM', 'SM', 'TW', 'UB', 'WD'],
		feeNote:
			'London and the South East usually sit at the top of UK fee ranges — full management often around 12–15% + VAT, sometimes higher once extras are included.',
		blurb:
			'London landlords need agents who understand micro-markets by borough, strong referencing in a competitive tenant pool, and crystal-clear all-in fees.',
	},
	{
		slug: 'manchester',
		name: 'Manchester',
		region: 'North West',
		nation: 'England',
		prefixes: ['M'],
		feeNote:
			'Manchester fees often sit mid-to-lower nationally — commonly around 8–12% + VAT for full management, with tenant-find as a fixed fee or year-one percentage.',
		blurb:
			'From city-centre apartments to suburban family lets, Manchester landlords should compare local knowledge, student vs professional tenant strategy, and full written fee schedules.',
	},
	{
		slug: 'birmingham',
		name: 'Birmingham',
		region: 'West Midlands',
		nation: 'England',
		prefixes: ['B'],
		feeNote:
			'Birmingham and the West Midlands often track mid-range UK pricing — typically around 8–12% + VAT for full management when comparing independents.',
		blurb:
			'Birmingham’s varied stock means your agent should price accurately for the neighbourhood and explain tenant-find versus full management in plain English.',
	},
	{
		slug: 'leeds',
		name: 'Leeds',
		region: 'Yorkshire',
		nation: 'England',
		prefixes: ['LS'],
		feeNote:
			'Leeds fees commonly sit toward Northern England bands — often around 8–12% + VAT for full management.',
		blurb:
			'Leeds landlords should weigh city-centre, student and suburban demand carefully, and instruct agents who can evidence recent local lets.',
	},
	{
		slug: 'liverpool',
		name: 'Liverpool',
		region: 'North West',
		nation: 'England',
		prefixes: ['L'],
		feeNote:
			'Liverpool full management often falls around 8–12% + VAT. Always confirm inventory, renewals and exit fees in writing.',
		blurb:
			'Compare regulated Liverpool agents on communication, maintenance response and how they protect client money — not just the headline percentage.',
	},
	{
		slug: 'bristol',
		name: 'Bristol',
		region: 'South West',
		nation: 'England',
		prefixes: ['BS'],
		feeNote:
			'Bristol can run a little firmer than Northern averages — often toward the middle or upper half of typical UK management bands.',
		blurb:
			'Strong tenant demand in parts of Bristol makes accurate pricing and thorough referencing especially important for landlords.',
	},
	{
		slug: 'sheffield',
		name: 'Sheffield',
		region: 'Yorkshire',
		nation: 'England',
		prefixes: ['S'],
		feeNote:
			'Sheffield usually tracks Northern England fee bands — often around 8–12% + VAT for full management.',
		blurb:
			'Sheffield landlords need accurate local rents across student, city and suburban pockets, plus clear management options.',
		featured: henrySpencerFeatured,
	},
	{
		slug: 'rotherham',
		name: 'Rotherham',
		region: 'Yorkshire',
		nation: 'England',
		prefixes: [],
		districts: ['S60', 'S61', 'S62', 'S63', 'S64', 'S65', 'S66'],
		feeNote:
			'Rotherham fees typically follow Northern England patterns — commonly around 8–12% + VAT for full management.',
		blurb:
			'Rotherham landlords should compare regulated local agents on transparent fees, tenant quality and day-to-day management depth.',
		featured: bricknellsFeatured,
	},
	{
		slug: 'doncaster',
		name: 'Doncaster',
		region: 'Yorkshire',
		nation: 'England',
		prefixes: ['DN'],
		feeNote:
			'Doncaster fees often sit toward the lower UK range versus London — commonly around 8–12% + VAT for full management.',
		blurb:
			'Doncaster landlords need local pricing knowledge, reliable tenant find and compliant management from agents who know DN postcodes within about nine miles of town.',
		featured: kerrigansFeatured,
	},
	{
		slug: 'newcastle',
		name: 'Newcastle',
		region: 'North East',
		nation: 'England',
		prefixes: ['NE'],
		feeNote:
			'Newcastle and the North East often sit at the more competitive end of UK management fees — still insist on an all-in written schedule.',
		blurb:
			'Local knowledge of student, professional and suburban demand helps Newcastle landlords avoid voids and overpricing.',
	},
	{
		slug: 'nottingham',
		name: 'Nottingham',
		region: 'East Midlands',
		nation: 'England',
		prefixes: ['NG'],
		feeNote:
			'Nottingham fees commonly fall around 8–12% + VAT for full management, depending on property type and service depth.',
		blurb:
			'Ask Nottingham agents how they handle student versus long-let strategies and what is included in management beyond the headline rate.',
	},
	{
		slug: 'leicester',
		name: 'Leicester',
		region: 'East Midlands',
		nation: 'England',
		prefixes: ['LE'],
		feeNote:
			'Leicester full management often tracks East Midlands norms — typically around 8–12% + VAT for independents.',
		blurb:
			'Compare Leicester agents on referencing standards, maintenance cover and whether fees include VAT and renewals.',
	},
	{
		slug: 'edinburgh',
		name: 'Edinburgh',
		region: 'Scotland',
		nation: 'Scotland',
		prefixes: ['EH'],
		feeNote:
			'Scottish lettings sit in a different legal framework (private residential tenancies). Fees vary — compare written schedules and local compliance support.',
		blurb:
			'Edinburgh landlords should instruct agents who understand Scottish tenancy rules, deposit schemes and local rental demand.',
	},
	{
		slug: 'glasgow',
		name: 'Glasgow',
		region: 'Scotland',
		nation: 'Scotland',
		prefixes: ['G'],
		feeNote:
			'Glasgow fees vary by stock and service. Focus on all-in cost and Scottish compliance competence, not percentage alone.',
		blurb:
			'Choose Glasgow agents who can explain Scottish tenancy law clearly and show recent local letting results.',
	},
	{
		slug: 'cardiff',
		name: 'Cardiff',
		region: 'Wales',
		nation: 'Wales',
		prefixes: ['CF'],
		feeNote:
			'Cardiff fees often sit mid-range. Confirm what is included for tenant find versus full management, including VAT.',
		blurb:
			'Cardiff landlords should shortlist regulated agents with strong local reviews and clear maintenance processes.',
	},
	{
		slug: 'belfast',
		name: 'Belfast',
		region: 'Northern Ireland',
		nation: 'Northern Ireland',
		prefixes: ['BT'],
		feeNote:
			'Northern Ireland has its own letting context. Compare local fee schedules carefully and ask how compliance is handled.',
		blurb:
			'Belfast landlords benefit from agents who know local demand and can explain fees and responsibilities in plain English.',
	},
	{
		slug: 'bath',
		name: 'Bath',
		region: 'South West',
		nation: 'England',
		prefixes: ['BA'],
		feeNote:
			'Bath can command firmer rents and fees than some regional markets — demand transparent all-in pricing.',
		blurb:
			'Heritage stock and strong demand mean Bath landlords need careful pricing and agents who manage compliance diligently.',
	},
	{
		slug: 'brighton',
		name: 'Brighton',
		region: 'South East',
		nation: 'England',
		prefixes: ['BN'],
		feeNote:
			'Brighton and the South Coast often sit above Northern fee averages — model VAT and extras before comparing.',
		blurb:
			'Brighton landlords should compare local specialists on tenant quality, HMO capability where relevant, and communication.',
	},
	{
		slug: 'southampton',
		name: 'Southampton',
		region: 'South East',
		nation: 'England',
		prefixes: ['SO'],
		feeNote:
			'Southampton fees typically sit mid-to-upper depending on the agent. Get pounds-and-pence quotes for your rent.',
		blurb:
			'Ask Southampton agents about student and professional demand in your street, plus full management inclusions.',
	},
	{
		slug: 'reading',
		name: 'Reading',
		region: 'South East',
		nation: 'England',
		prefixes: ['RG'],
		feeNote:
			'Reading and Thames Valley fees can run higher than Northern averages — compare inclusive schedules.',
		blurb:
			'Commuter demand makes accurate rents and fast, quality referencing important for Reading landlords.',
	},
	{
		slug: 'cambridge',
		name: 'Cambridge',
		region: 'East of England',
		nation: 'England',
		prefixes: ['CB'],
		feeNote:
			'Cambridge can sit toward the higher end regionally. Always confirm renewals and exit terms.',
		blurb:
			'Strong local demand means Cambridge landlords should prioritise agents who price realistically and vet tenants thoroughly.',
	},
	{
		slug: 'oxford',
		name: 'Oxford',
		region: 'South East',
		nation: 'England',
		prefixes: ['OX'],
		feeNote:
			'Oxford fees often reflect a competitive southern market — insist on transparent all-in costs.',
		blurb:
			'Oxford landlords should compare agents on local knowledge, compliance and how they handle maintenance.',
	},
	{
		slug: 'york',
		name: 'York',
		region: 'Yorkshire',
		nation: 'England',
		prefixes: ['YO'],
		feeNote:
			'York fees usually follow Northern patterns — often around 8–12% + VAT for full management.',
		blurb:
			'Tourism and local demand mix differently by street in York — instruct an agent who knows the micro-market.',
	},
	{
		slug: 'hull',
		name: 'Hull',
		region: 'Yorkshire',
		nation: 'England',
		prefixes: ['HU'],
		feeNote:
			'Hull often sits at the more competitive end of management fees. Still compare extras carefully.',
		blurb:
			'Hull landlords should verify regulation, published fees and recent local performance before instructing.',
	},
	{
		slug: 'coventry',
		name: 'Coventry',
		region: 'West Midlands',
		nation: 'England',
		prefixes: ['CV'],
		feeNote:
			'Coventry fees commonly sit mid-range for the Midlands. Request written schedules including VAT.',
		blurb:
			'Compare Coventry agents on student versus long-let experience and how repairs are coordinated.',
	},
	{
		slug: 'plymouth',
		name: 'Plymouth',
		region: 'South West',
		nation: 'England',
		prefixes: ['PL'],
		feeNote:
			'Plymouth fees typically follow South West regional norms — confirm what full management includes.',
		blurb:
			'Local agents who understand Plymouth demand and maintenance logistics help landlords stay hands-off with confidence.',
	},
	{
		slug: 'norwich',
		name: 'Norwich',
		region: 'East of England',
		nation: 'England',
		prefixes: ['NR'],
		feeNote:
			'Norwich fees often sit mid-range. Compare tenant-find and managed options side by side.',
		blurb:
			'Norwich landlords should shortlist regulated agents with clear communication and local letting evidence.',
	},
	{
		slug: 'derby',
		name: 'Derby',
		region: 'East Midlands',
		nation: 'England',
		prefixes: ['DE'],
		feeNote:
			'Derby full management commonly falls around typical Midlands bands — about 8–12% + VAT for many independents.',
		blurb:
			'Ask Derby agents for comparable recent lets and a complete fee list before you decide.',
	},
	{
		slug: 'newport',
		name: 'Newport',
		region: 'Wales',
		nation: 'Wales',
		prefixes: ['NP'],
		feeNote:
			'Newport fees vary by agent and stock. Focus on inclusive pricing and local service quality.',
		blurb:
			'Newport landlords should verify trust checks and compare full management against tenant find for their situation.',
	},
	{
		slug: 'aberdeen',
		name: 'Aberdeen',
		region: 'Scotland',
		nation: 'Scotland',
		prefixes: ['AB'],
		feeNote:
			'Aberdeen sits under Scottish tenancy rules. Compare local fee schedules and compliance support carefully.',
		blurb:
			'Choose Aberdeen agents who understand local market cycles and can explain Scottish landlord responsibilities clearly.',
	},
];

export function areaPath(slug: string) {
	return `/letting-agents/${slug}/`;
}

/** Normalise a UK postcode and return postal area / district (shared parsers). */
export function matchAreaByPostcode(postcode: string): Area | null {
	const district = getDistrictCode(postcode);
	if (district) {
		const byDistrict = areas.find((area) => area.districts?.includes(district));
		if (byDistrict) return byDistrict;
	}

	const postalArea = getPostalAreaCode(postcode);
	if (!postalArea) return null;

	// Longest prefix first so SW beats S-style mistakes; prefixes are exact postal areas
	const ranked = [...areas].sort((a, b) => {
		const aMax = Math.max(0, ...a.prefixes.map((p) => p.length));
		const bMax = Math.max(0, ...b.prefixes.map((p) => p.length));
		return bMax - aMax;
	});

	return ranked.find((area) => area.prefixes.includes(postalArea)) ?? null;
}

export function areasByRegion() {
	const map = new Map<string, Area[]>();
	for (const area of areas) {
		const list = map.get(area.region) ?? [];
		list.push(area);
		map.set(area.region, list);
	}
	return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export function getAreaBySlug(slug: string) {
	return areas.find((area) => area.slug === slug);
}
