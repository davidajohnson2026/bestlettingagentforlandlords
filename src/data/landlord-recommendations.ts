/**
 * Moderated landlord recommendations shown on /recommend/.
 * Add entries here after reviewing form submissions — do not auto-publish.
 */
export type LandlordRecommendation = {
	id: string;
	agentName: string;
	area: string;
	/** 1–5 */
	rating: 1 | 2 | 3 | 4 | 5;
	quote: string;
	/** Display name, e.g. "David J." — never full address */
	landlordLabel: string;
	/** ISO date YYYY-MM-DD */
	date: string;
	/** Optional deep link to an area guide */
	areaHref?: string;
};

/** Published after moderation. Start empty — first real submissions go live here. */
export const publishedRecommendations: LandlordRecommendation[] = [];
