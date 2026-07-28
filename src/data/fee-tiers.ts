/** Shared UK letting fee bands for homepage + fees guide cards */

export type FeeTier = {
	label: string;
	also: string;
	price: string;
	priceNote: string;
	example: string;
	includes: string[];
	href: string;
	featured?: boolean;
};

export const feeTiers: FeeTier[] = [
	{
		label: 'Tenant find',
		also: 'Let only',
		price: '4–8%',
		priceNote: 'of first year’s rent (one-off) or ~£400–£1,500',
		example: 'On £1,200/mo ≈ £576–£1,152 once',
		includes: ['Marketing & viewings', 'Referencing', 'Tenancy setup'],
		href: '/full-management-vs-tenant-find/',
	},
	{
		label: 'Rent collection',
		also: 'Mid tier',
		price: '5–10%',
		priceNote: 'of monthly rent (+ VAT where applicable)',
		example: 'On £1,200/mo ≈ £720–£1,440 / year',
		includes: ['Tenant find elements', 'Rent processing', 'Arrears chasing'],
		href: '/full-management-vs-tenant-find/',
	},
	{
		label: 'Full management',
		also: 'Most hands-off',
		price: '8–15%',
		priceNote: 'of monthly rent (+ VAT) — London often higher',
		example: 'On £1,200/mo ≈ £1,152–£2,160 / year before extras',
		includes: ['Rent collection', 'Repairs coordination', 'Inspections & day-to-day'],
		href: '/full-management-vs-tenant-find/',
		featured: true,
	},
];
