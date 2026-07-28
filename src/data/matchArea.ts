import { areas, type Area } from './areas';
import { getDistrictCode, getPostalAreaCode } from './recommendations';

/** Match a UK postcode to the best area guide (districts first, then postal area). */
export function matchArea(postcode: string, list: Area[] = areas): Area | null {
	const district = getDistrictCode(postcode);
	if (district) {
		const byDistrict = list.find((area) => area.districts?.includes(district));
		if (byDistrict) return byDistrict;
	}

	const postalArea = getPostalAreaCode(postcode);
	if (!postalArea) return null;

	const ranked = [...list].sort((a, b) => {
		const aMax = Math.max(0, ...a.prefixes.map((p) => p.length));
		const bMax = Math.max(0, ...b.prefixes.map((p) => p.length));
		return bMax - aMax;
	});

	return ranked.find((area) => area.prefixes.includes(postalArea)) ?? null;
}

export function areasWithFeatured(list: Area[] = areas): Area[] {
	return list.filter((area) => Boolean(area.featured));
}
