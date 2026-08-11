import type { DonationPromptState } from './types';

export type DonationPromptAction = 'episode-completed' | 'dismissed' | 'donated';

async function postAction(action: DonationPromptAction): Promise<DonationPromptState | null> {
	const response = await fetch('/api/donations', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ action })
	});

	if (!response.ok) return null;

	const payload = await response.json();
	return payload.state ?? null;
}

export async function recordEpisodeCompleted(): Promise<DonationPromptState | null> {
	return postAction('episode-completed');
}

export async function recordDismissal(): Promise<void> {
	await postAction('dismissed');
}

export async function recordDonation(): Promise<void> {
	await postAction('donated');
}
