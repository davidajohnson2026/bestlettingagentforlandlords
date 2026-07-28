/** Guided landlord chat options (static site — no live AI backend) */

export type ChatChoice = {
	id: string;
	label: string;
	reply: string;
	href?: string;
	cta?: string;
};

export const chatGreeting =
	"Hi — I'm the landlord assistant for Best Letting Agent for Landlords. Pick a question and I'll point you to the right next step.";

export const chatChoices: ChatChoice[] = [
	{
		id: 'compare',
		label: 'Compare agents near me',
		reply:
			'Enter your UK postcode and we’ll match local guidance — Kerrigans for Doncaster (~9 miles), Henry Spencer for Sheffield, Bricknells for Rotherham, or area checklists elsewhere.',
		href: '/compare/',
		cta: 'Open compare tool',
	},
	{
		id: 'fees',
		label: 'How much do agents charge?',
		reply:
			'Typical UK bands: tenant find ~4–8% of year-one rent, rent collection ~5–10% monthly, full management ~8–15% monthly (+ VAT). Always get the full written schedule.',
		href: '/letting-agent-fees/',
		cta: 'Read the fees guide',
	},
	{
		id: 'service',
		label: 'Full management or tenant find?',
		reply:
			'Tenant find suits hands-on local landlords. Full management suits distant, busy or portfolio landlords who want rent, repairs and day-to-day handled.',
		href: '/full-management-vs-tenant-find/',
		cta: 'Compare service levels',
	},
	{
		id: 'phone',
		label: 'What should I ask on the phone?',
		reply:
			'Ask for the full fee schedule (incl. VAT), referencing depth, repair response times, ARLA/CMP/redress membership, and clear exit terms — before you instruct.',
		href: '/questions-to-ask-a-letting-agent/',
		cta: 'Open phone checklist',
	},
	{
		id: 'choose',
		label: 'How do I choose an agent?',
		reply:
			'Check accreditation, Client Money Protection, published fees, recent landlord reviews and proven local lets — not just the shopfront brochure.',
		href: '/how-to-choose-a-letting-agent/',
		cta: 'See the choose guide',
	},
];
