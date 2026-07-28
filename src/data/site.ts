export const SITE = {
	name: 'Best Letting Agent for Landlords',
	shortName: 'Best Letting Agent',
	url: 'https://bestlettingagentforlandlords.co.uk',
	domain: 'bestlettingagentforlandlords.co.uk',
	locale: 'en-GB',
	description:
		'Compare UK letting agent fees, ratings and local performance nationwide. Independent guidance for landlords choosing tenant-find or full management.',
	ogImage: 'https://bestlettingagentforlandlords.co.uk/hero-property.jpg',
	sameAs: [] as string[],
	/** Where landlord recommendation form submissions are sent (FormSubmit / inbox) */
	recommendationsEmail: 'hello@bestlettingagentforlandlords.co.uk',
} as const;

/** Related landlord finance site */
export const MORTGAGE_PARTNER = {
	name: 'MortgageRM',
	url: 'https://mortgagerm.co.uk/',
	label: 'Buy-to-let & remortgage guidance',
	blurb:
		'Once agent fees are clear, check your buy-to-let mortgage or remortgage options so yield still works after management costs.',
};

export type NavLink = {
	href: string;
	label: string;
};

/** Primary guide links — desktop nests most under Guides */
export const NAV_GUIDES: NavLink[] = [
	{ href: '/letting-agent-fees/', label: 'Fees' },
	{ href: '/full-management-vs-tenant-find/', label: 'Managed vs let-only' },
	{ href: '/property-management-companies/', label: 'Property managers' },
	{ href: '/how-to-choose-a-letting-agent/', label: 'How to choose' },
	{ href: '/questions-to-ask-a-letting-agent/', label: 'Phone checklist' },
	{ href: '/recommend/', label: 'Recommend an agent' },
];

/** Top-level Fees stays visible; remaining guides sit in the Guides menu */
export const NAV_FEES = NAV_GUIDES[0];
export const NAV_GUIDE_MENU = NAV_GUIDES.slice(1);

/** Highlight cities in the Areas menu (full list on /letting-agents/) */
export const NAV_AREAS: NavLink[] = [
	{ href: '/letting-agents/', label: 'All UK areas' },
	{ href: '/letting-agents/london/', label: 'London' },
	{ href: '/letting-agents/manchester/', label: 'Manchester' },
	{ href: '/letting-agents/birmingham/', label: 'Birmingham' },
	{ href: '/letting-agents/leeds/', label: 'Leeds' },
	{ href: '/letting-agents/edinburgh/', label: 'Edinburgh' },
	{ href: '/letting-agents/glasgow/', label: 'Glasgow' },
	{ href: '/letting-agents/cardiff/', label: 'Cardiff' },
	{ href: '/letting-agents/belfast/', label: 'Belfast' },
	{ href: '/letting-agents/doncaster/', label: 'Doncaster' },
];

/** Flat list for simple loops */
export const NAV = [
	...NAV_GUIDES,
	...NAV_AREAS,
	{ href: '/compare/', label: 'Compare' },
	{ href: '/#faq', label: 'FAQ' },
];
