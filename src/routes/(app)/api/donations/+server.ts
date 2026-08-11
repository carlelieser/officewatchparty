import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { DonationPromptAction } from '$lib/features/donations/api';

const VALID_ACTIONS: Array<DonationPromptAction> = ['episode-completed', 'dismissed', 'donated'];

function isValidAction(value: unknown): value is DonationPromptAction {
	return VALID_ACTIONS.includes(value as DonationPromptAction);
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { action } = await request.json();

	if (!isValidAction(action)) error(400, 'A valid action is required');

	if (action === 'episode-completed') {
		const state = await locals.repos.donations.recordEpisodeCompleted(locals.user.id);
		return json({ state });
	}

	if (action === 'dismissed') {
		await locals.repos.donations.recordDismissal(locals.user.id);
		return json({ success: true });
	}

	await locals.repos.donations.recordDonation(locals.user.id);
	return json({ success: true });
};
