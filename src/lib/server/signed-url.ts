import { env } from '$env/dynamic/private';

const encoder = new TextEncoder();

async function computeHmacSignature(message: string): Promise<string> {
	const secret = env.SIGNING_SECRET;
	if (!secret) throw new Error('SIGNING_SECRET is not set');

	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);

	const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
	const signatureBytes = new Uint8Array(signatureBuffer);
	const hexPairs = Array.from(signatureBytes).map((byte) => byte.toString(16).padStart(2, '0'));
	return hexPairs.join('');
}

export async function sign(path: string, expiresInSeconds = 3600): Promise<string> {
	const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
	const signature = await computeHmacSignature(`${path}:${expires}`);
	return `${path}?expires=${expires}&sig=${signature}`;
}

export async function verify(path: string, expires: string, signature: string): Promise<boolean> {
	const now = Math.floor(Date.now() / 1000);
	if (now > Number(expires)) return false;
	const expected = await computeHmacSignature(`${path}:${expires}`);
	return signature === expected;
}
