import { env } from '$env/dynamic/private';

const encoder = new TextEncoder();

async function hmac(message: string): Promise<string> {
	const secret = env.SIGNING_SECRET;
	if (!secret) throw new Error('SIGNING_SECRET is not set');

	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
	return Array.from(new Uint8Array(signature))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
}

export async function sign(path: string, expiresInSeconds = 3600): Promise<string> {
	const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
	const sig = await hmac(`${path}:${expires}`);
	return `${path}?expires=${expires}&sig=${sig}`;
}

export async function verify(path: string, expires: string, sig: string): Promise<boolean> {
	const now = Math.floor(Date.now() / 1000);
	if (now > Number(expires)) return false;
	const expected = await hmac(`${path}:${expires}`);
	return sig === expected;
}
