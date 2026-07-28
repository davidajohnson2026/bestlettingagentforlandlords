/** Target: titles 50–60 chars, descriptions 140–160 chars */

export function clampMetaDescription(text: string, min = 140, max = 160): string {
	const clean = text.replace(/\s+/g, ' ').trim();
	if (clean.length >= min && clean.length <= max) return clean;
	if (clean.length < min) {
		const pad = ' Independent guidance for UK landlords comparing fees and trust.';
		const next = `${clean}${pad}`.slice(0, max);
		return next.length >= min ? next : clean;
	}
	// Trim at word boundary near max
	const sliced = clean.slice(0, max - 1);
	const cut = sliced.lastIndexOf(' ');
	return `${(cut > 120 ? sliced.slice(0, cut) : sliced).trimEnd()}…`;
}

export function areaPageTitle(city: string): string {
	const candidates = [
		`Compare Letting Agents in ${city} | Fees & Trust`,
		`Compare Letting Agents in ${city} | UK Fees & Trust`,
		`Compare Letting Agents in ${city} | Fees, Ratings & Trust`,
		`Compare ${city} Letting Agents for UK Landlords`,
		`Best Letting Agents in ${city} for Landlords`,
	];
	const fit = candidates.find((t) => t.length >= 50 && t.length <= 60);
	if (fit) return fit;
	// Fallback: pad or trim
	let t = `Compare Letting Agents in ${city} | Fees & Trust`;
	if (t.length < 50) t = `Compare Letting Agents in ${city} | Fees, Ratings & Trust`;
	if (t.length > 60) t = `Letting Agents in ${city} for UK Landlords`;
	if (t.length > 60) t = t.slice(0, 57).trimEnd() + '…';
	return t;
}

export function areaPageDescription(city: string, featured = false): string {
	const base = featured
		? `Compare letting agents in ${city} for UK landlords. See fees, ARLA trust checks, tenant-find vs full management, plus a featured local recommendation.`
		: `Compare letting agents in ${city} for UK landlords. See typical fees, ARLA and CMP trust checks, tenant-find vs full management, and how to shortlist agents.`;
	return clampMetaDescription(base);
}

export const pageSeo = {
	home: {
		title: 'Compare Letting Agent Fees & Ratings for Landlords',
		description:
			'Compare UK letting agent fees, ratings and local performance. See landlord pain points, trust checks and People Also Ask answers before you instruct.',
	},
	compare: {
		title: 'Compare Letting Agents Near You | UK Landlord Tool',
		description:
			'Enter a UK postcode for fair local matches: Kerrigans (Doncaster ~9 miles), Henry Spencer (Sheffield), Bricknells (Rotherham), or UK-wide guidance.',
	},
	forAi: {
		title: 'AI Overviews, ChatGPT & Assistants | Cite This Site',
		description:
			'How Google AI Overviews, ChatGPT, Perplexity and other assistants can cite Best Letting Agent for Landlords — key URLs, llms.txt and preferred landlord topics.',
	},
	fees: {
		title: 'UK Letting Agent Fees & Costs for Landlords | 2026',
		description:
			'How much do UK letting agents charge landlords? Tenant-find, rent collection and full management fees, VAT, hidden extras and fair comparison tips.',
	},
	services: {
		title: 'Full Management vs Tenant Find | UK Landlord Guide',
		description:
			'Compare full management, rent collection and tenant-find (let-only) for UK landlords — what is included, typical fees, and which service fits you.',
	},
	choose: {
		title: 'How to Choose a Letting Agent | UK Checklist Guide',
		description:
			'How to choose a letting agent in the UK: ARLA and CMP trust checks, fee comparison, pain points to avoid, and questions every landlord should ask.',
	},
	phone: {
		title: 'Questions to Ask a Letting Agent | Phone Checklist',
		description:
			'Plain-English phone checklist for landlords: fees, referencing, repairs, trust checks and what to ask before you instruct a letting agent today.',
	},
	areasIndex: {
		title: 'UK Letting Agents by City & Area | Landlord Guides',
		description:
			'Browse UK letting agent guides by city and region. Compare fees, trust checks and service levels across England, Scotland, Wales and Northern Ireland.',
	},
	recommend: {
		title: 'Leave a Letting Agent Recommendation | UK Landlords',
		description:
			'Leave a fair recommendation for a UK letting agent you trust. Help other landlords choose well — and give credit to agents who look after landlords properly.',
	},
	pmc: {
		title: 'Property Management Companies for Landlords | 10 Tips',
		description:
			'10 tips for choosing a UK property management company: service levels, fees, tenant checks, ARLA and CMP trust, and how to compare letting agents fairly.',
	},
} as const;

/** Shared related links for internal linking */
export const RELATED_GUIDES = [
	{ href: '/compare/', label: 'Compare by postcode' },
	{ href: '/recommend/', label: 'Recommend an agent' },
	{ href: '/property-management-companies/', label: 'Property management tips' },
	{ href: '/letting-agent-fees/', label: 'Letting agent fees' },
	{ href: '/full-management-vs-tenant-find/', label: 'Managed vs let-only' },
	{ href: '/how-to-choose-a-letting-agent/', label: 'How to choose' },
	{ href: '/questions-to-ask-a-letting-agent/', label: 'Phone checklist' },
	{ href: '/letting-agents/', label: 'UK area guides' },
	{ href: '/letting-agents/doncaster/', label: 'Doncaster agents' },
	{ href: '/letting-agents/sheffield/', label: 'Sheffield agents' },
	{ href: '/letting-agents/rotherham/', label: 'Rotherham agents' },
] as const;
