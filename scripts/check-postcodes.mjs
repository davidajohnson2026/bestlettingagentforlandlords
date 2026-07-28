#!/usr/bin/env node
/**
 * Regression checks for UK outward-code parsing / Kerrigans radius.
 * Uses Node's TypeScript strip-types (engines.node >= 22.12).
 */
import { pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const modUrl = pathToFileURL(join(root, 'src/data/recommendations.ts')).href;

const { getDistrictCode, getPostalAreaCode, isWithinKerrigansRadius } = await import(modUrl);

const districtCases = [
	['DN1 1AA', 'DN1'],
	['DN2 1AA', 'DN2'],
	['DN7 2BB', 'DN7'],
	['DN9 3AA', 'DN9'],
	['DN11 0AA', 'DN11'],
	['DN8 5AA', 'DN8'],
	['DN21 1AA', 'DN21'],
	['S1 2AA', 'S1'],
	['S60 1AA', 'S60'],
	['S12 2AA', 'S12'],
	['M1 1AE', 'M1'],
	['DN2', 'DN2'],
	['DN11', 'DN11'],
	['dn2 1aa', 'DN2'],
];

const kerrigansCases = [
	['DN1 1AA', true],
	['DN2 1AA', true],
	['DN7 2BB', true],
	['DN9 3AA', true],
	['DN11 0AA', true],
	['DN12 1AA', true],
	['DN8 5AA', false],
	['DN10 1AA', false],
	['DN21 1AA', false],
	['S1 2AA', false],
	['DN', true],
];

const failures = [];

for (const [input, expected] of districtCases) {
	const got = getDistrictCode(input);
	if (got !== expected) failures.push(`district ${input}: got ${got}, expected ${expected}`);
}

for (const [input, expected] of kerrigansCases) {
	const got = isWithinKerrigansRadius(input);
	if (got !== expected) failures.push(`kerrigans ${input}: got ${got}, expected ${expected}`);
}

if (getPostalAreaCode('DN2 1AA') !== 'DN') {
	failures.push(`postal area DN2 1AA: got ${getPostalAreaCode('DN2 1AA')}`);
}
if (getPostalAreaCode('S1 2AA') !== 'S') {
	failures.push(`postal area S1 2AA: got ${getPostalAreaCode('S1 2AA')}`);
}

if (failures.length) {
	console.error(`Postcode check failed (${failures.length}):\n` + failures.map((f) => ` - ${f}`).join('\n'));
	process.exit(1);
}

console.log(`Postcode check passed: ${districtCases.length} district + ${kerrigansCases.length} radius cases.`);
