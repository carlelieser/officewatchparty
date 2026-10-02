import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { season, episode, content } = await request.json();
	if (!content?.trim()) error(400, 'Content is required');
	if (!season || !episode) error(400, 'Season and episode are required');

	await locals.repos.episodeComments.insert(season, episode, locals.user.id, content.trim());
	return json({ success: true });
};
