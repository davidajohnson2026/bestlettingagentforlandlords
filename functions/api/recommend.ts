interface Env {
	BREVO_API_KEY?: string;
	BREVO_SENDER_EMAIL?: string;
	CONTACT_TO?: string;
}

const DEFAULT_FROM = 'hello@bestlettingagentforlandlords.co.uk';
const DEFAULT_TO = 'hello@bestlettingagentforlandlords.co.uk';

function sanitize(text: string, maxLen: number): string {
	return text.trim().slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

async function sendViaBrevo(
	env: Env,
	options: {
		fromEmail: string;
		to: string;
		replyToName: string;
		replyToEmail: string;
		subject: string;
		text: string;
	},
): Promise<void> {
	const apiKey = env.BREVO_API_KEY?.trim();
	if (!apiKey) {
		throw new Error('Brevo not configured');
	}

	const senderEmail = env.BREVO_SENDER_EMAIL?.trim() || options.fromEmail;
	const response = await fetch('https://api.brevo.com/v3/smtp/email', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'api-key': apiKey,
		},
		body: JSON.stringify({
			sender: { name: 'Best Letting Agent Website', email: senderEmail },
			to: [{ email: options.to }],
			replyTo: { email: options.replyToEmail, name: options.replyToName },
			subject: options.subject,
			textContent: options.text,
		}),
	});

	if (!response.ok) {
		const detail = await response.text();
		throw new Error(`Brevo ${response.status}: ${detail}`);
	}

	const detail = await response.text();
	let messageId = '';
	try {
		const parsed = JSON.parse(detail) as { messageId?: string };
		messageId = parsed.messageId?.trim() ?? '';
	} catch {
		// ignore
	}
	if (!messageId) {
		throw new Error(`Brevo accepted but no messageId: ${detail}`);
	}
}

function resolveSenderEmail(env: Env, defaultFrom: string): string {
	const configured = env.BREVO_SENDER_EMAIL?.trim() || defaultFrom;
	if (/luxeglowstudio\.co\.uk/i.test(configured)) return defaultFrom;
	return configured;
}

function resolveContactTo(env: Env, defaultTo: string): string {
	const configured = env.CONTACT_TO?.trim() || defaultTo;
	if (/luxeglowstudio\.co\.uk/i.test(configured)) return defaultTo;
	return configured;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
	const { request, env } = context;

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return jsonResponse({ ok: false, message: 'Invalid form submission.' }, 400);
	}

	if (String(formData.get('_honey') ?? '').trim()) {
		return jsonResponse({ ok: true, message: 'Thanks! Your recommendation was sent.' });
	}

	const agentName = sanitize(String(formData.get('agent_name') ?? ''), 120);
	const area = sanitize(String(formData.get('area') ?? ''), 80);
	const postcode = sanitize(String(formData.get('postcode') ?? ''), 12);
	const rating = sanitize(String(formData.get('rating') ?? ''), 2);
	const recommendation = sanitize(String(formData.get('recommendation') ?? ''), 800);
	const landlordName = sanitize(String(formData.get('landlord_name') ?? ''), 40);
	const email = sanitize(String(formData.get('email') ?? ''), 254);
	const consent = String(formData.get('consent_publish') ?? '').trim();

	if (
		!agentName ||
		!area ||
		!rating ||
		!recommendation ||
		!landlordName ||
		!email ||
		!consent ||
		!isValidEmail(email)
	) {
		return jsonResponse(
			{ ok: false, message: 'Please complete all required fields.' },
			400,
		);
	}

	const contactTo = resolveContactTo(env, DEFAULT_TO);
	const fromEmail = resolveSenderEmail(env, DEFAULT_FROM);
	const sentAt = new Date().toISOString();
	const subject = `Landlord recommendation — ${agentName} (${area})`;
	const body = [
		`Agent: ${agentName}`,
		`Area: ${area}`,
		postcode ? `Postcode: ${postcode}` : '',
		`Rating: ${rating}/5`,
		`Landlord: ${landlordName}`,
		`Email: ${email}`,
		`Consent to publish: ${consent}`,
		`Sent: ${sentAt}`,
		'',
		recommendation,
		'',
		'---',
		'Sent from bestlettingagentforlandlords.co.uk/recommend/',
	]
		.filter(Boolean)
		.join('\n');

	try {
		await sendViaBrevo(env, {
			fromEmail,
			to: contactTo,
			replyToName: landlordName,
			replyToEmail: email,
			subject,
			text: body,
		});
	} catch (error) {
		console.error('Recommendation send failed', error);
		return jsonResponse(
			{
				ok: false,
				message:
					'Your recommendation could not be sent. Please try again later or email hello@bestlettingagentforlandlords.co.uk.',
			},
			500,
		);
	}

	return jsonResponse({
		ok: true,
		message: 'Thanks! Your recommendation was sent for moderation.',
		redirect: '/recommend/thanks/',
	});
};
