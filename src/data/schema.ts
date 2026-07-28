import type { FaqItem } from '../data/faq';
import type { FeaturedAgent } from './recommendations';
import { SITE } from './site';

/** Stable node IDs so pages can reference the same Organization / WebSite graph */
export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

function absoluteUrl(path: string) {
	return new URL(path, SITE.url).toString();
}

/** Site publisher — emitted on every indexable page via BaseLayout */
export function organizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': ORG_ID,
		name: SITE.name,
		alternateName: SITE.shortName,
		url: SITE.url,
		logo: {
			'@type': 'ImageObject',
			url: `${SITE.url}/logo.svg`,
			contentUrl: `${SITE.url}/logo.svg`,
		},
		image: SITE.ogImage,
		description: SITE.description,
		email: SITE.recommendationsEmail,
		areaServed: {
			'@type': 'Country',
			name: 'United Kingdom',
		},
		knowsAbout: [
			'Letting agents',
			'Landlord fees',
			'Property management',
			'ARLA Propertymark',
			'Tenant find services',
			'Full management lettings',
		],
		...(SITE.sameAs.length > 0 ? { sameAs: SITE.sameAs } : {}),
	};
}

/** Site node + postcode search action — emitted on every indexable page via BaseLayout */
export function websiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: SITE.name,
		url: SITE.url,
		description: SITE.description,
		inLanguage: 'en-GB',
		publisher: { '@id': ORG_ID },
		potentialAction: {
			'@type': 'SearchAction',
			target: {
				'@type': 'EntryPoint',
				urlTemplate: `${SITE.url}/compare/?postcode={search_term_string}`,
			},
			'query-input': 'required name=search_term_string',
		},
	};
}

/** Generic page wrapper for tools / forms / hubs that are not long-form articles */
export function webPageSchema(opts: {
	name: string;
	description: string;
	path: string;
	datePublished?: string;
	dateModified?: string;
}) {
	const url = absoluteUrl(opts.path);
	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${url}#webpage`,
		url,
		name: opts.name,
		description: opts.description,
		isPartOf: { '@id': WEBSITE_ID },
		about: { '@id': ORG_ID },
		inLanguage: 'en-GB',
		isAccessibleForFree: true,
		datePublished: opts.datePublished ?? '2026-07-28',
		dateModified: opts.dateModified ?? '2026-07-28',
		publisher: { '@id': ORG_ID },
	};
}

export function articleSchema(opts: {
	headline: string;
	description: string;
	path: string;
	datePublished?: string;
	dateModified?: string;
}) {
	const url = absoluteUrl(opts.path);
	return {
		'@context': 'https://schema.org',
		'@type': 'Article',
		'@id': `${url}#article`,
		headline: opts.headline,
		description: opts.description,
		url,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${url}#webpage`,
		},
		isPartOf: { '@id': WEBSITE_ID },
		inLanguage: 'en-GB',
		isAccessibleForFree: true,
		datePublished: opts.datePublished ?? '2026-07-28',
		dateModified: opts.dateModified ?? '2026-07-28',
		author: { '@id': ORG_ID },
		publisher: { '@id': ORG_ID },
		image: [SITE.ogImage],
	};
}

/**
 * Featured letting agent — LocalBusiness (not Product).
 * Product schema is reserved for sellable goods; agents are local service businesses.
 */
export function localBusinessSchema(opts: {
	agent: FeaturedAgent;
	city: string;
	path: string;
}) {
	const pageUrl = absoluteUrl(opts.path);
	return {
		'@context': 'https://schema.org',
		'@type': 'RealEstateAgent',
		'@id': `${pageUrl}#featured-agent`,
		name: opts.agent.name,
		url: opts.agent.url,
		telephone: opts.agent.phone,
		description: opts.agent.summary,
		areaServed: {
			'@type': 'City',
			name: opts.city,
		},
		knowsAbout: opts.agent.highlights,
	};
}

/** Free compare tool — SoftwareApplication / WebApplication (not a Product offer) */
export function webApplicationSchema(opts: {
	name: string;
	description: string;
	path: string;
}) {
	const url = absoluteUrl(opts.path);
	return {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		'@id': `${url}#app`,
		name: opts.name,
		description: opts.description,
		url,
		applicationCategory: 'BusinessApplication',
		operatingSystem: 'Any',
		browserRequirements: 'Requires JavaScript for live postcode matching',
		inLanguage: 'en-GB',
		isAccessibleForFree: true,
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'GBP',
			availability: 'https://schema.org/InStock',
		},
		provider: { '@id': ORG_ID },
		isPartOf: { '@id': WEBSITE_ID },
	};
}

/** Optional Service node for the site’s free landlord guidance offering */
export function serviceSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		'@id': `${SITE.url}/#landlord-comparison-service`,
		name: 'UK letting agent comparison for landlords',
		description: SITE.description,
		serviceType: 'Letting agent comparison and landlord guidance',
		provider: { '@id': ORG_ID },
		areaServed: {
			'@type': 'Country',
			name: 'United Kingdom',
		},
		isRelatedTo: { '@id': WEBSITE_ID },
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'GBP',
		},
	};
}

export function itemListSchema(
	name: string,
	items: { name: string; path: string; description?: string }[],
) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name,
		numberOfItems: items.length,
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			url: absoluteUrl(item.path),
			...(item.description ? { description: item.description } : {}),
		})),
	};
}

export function faqSchema(items: FaqItem[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer,
			},
		})),
	};
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.path),
		})),
	};
}

export function howToSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: 'How to choose a letting agent as a UK landlord',
		description:
			'A practical checklist for landlords comparing letting agents on fees, trust and local performance.',
		inLanguage: 'en-GB',
		totalTime: 'PT30M',
		step: [
			{
				'@type': 'HowToStep',
				position: 1,
				name: 'Shortlist regulated local agents',
				text: 'Find three local firms with ARLA Propertymark or Safeagent membership and verify Client Money Protection plus redress scheme details.',
			},
			{
				'@type': 'HowToStep',
				position: 2,
				name: 'Compare the full fee schedule',
				text: 'Request written fees including VAT, setup, renewals, inventories and exit charges — not just the headline management percentage.',
			},
			{
				'@type': 'HowToStep',
				position: 3,
				name: 'Interview on local results',
				text: 'Ask about time-to-let, achieved rents, referencing standards and who handles maintenance day to day.',
			},
			{
				'@type': 'HowToStep',
				position: 4,
				name: 'Instruct the strongest fit',
				text: 'Choose the agent with transparent pricing, proven local performance and clear compliance processes.',
			},
		],
	};
}
