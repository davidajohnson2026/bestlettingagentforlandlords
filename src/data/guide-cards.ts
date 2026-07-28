/** Image-led guide cards for homepage / related strips */

export type GuideCard = {
	href: string;
	title: string;
	blurb: string;
	image: string;
	imageAlt: string;
};

export const guideCards: GuideCard[] = [
	{
		href: '/how-to-choose-a-letting-agent/',
		title: 'How do I choose a letting agent?',
		blurb: 'Trust checks, fee clarity and local fit — the landlord checklist before you instruct.',
		image: '/guides/choose-agent.jpg',
		imageAlt: 'UK terraced homes on a residential street',
	},
	{
		href: '/letting-agent-fees/',
		title: 'How much do letting agents charge?',
		blurb: 'Typical UK bands for tenant find, rent collection and full management — plus hidden extras.',
		image: '/guides/fees.jpg',
		imageAlt: 'Calculator and paperwork for landlord fee planning',
	},
	{
		href: '/property-management-companies/',
		title: 'What are property management companies?',
		blurb: 'Ten tips for landlords comparing management firms on service, fees and compliance.',
		image: '/guides/management.jpg',
		imageAlt: 'Modern apartment building exterior',
	},
	{
		href: '/questions-to-ask-a-letting-agent/',
		title: 'What should I ask on the phone?',
		blurb: 'A plain-English call checklist covering fees, referencing, repairs and trust schemes.',
		image: '/guides/checklist.jpg',
		imageAlt: 'Landlord reviewing documents and notes',
	},
];
