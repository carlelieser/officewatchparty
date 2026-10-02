import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';
import { sign } from '$lib/server/signed-url';
import { padNumber } from '$lib/shared/format';

function buildVideoPath(season: number, episode: number): string {
	const seasonCode = `S${padNumber(season)}`;
	return `/video/${seasonCode}/${seasonCode}E${padNumber(episode)}.mp4`;
}

export const load: PageServerLoad = async ({ url, locals }) => {
	const season = Number(url.searchParams.get('season'));
	const episodeNumber = Number(url.searchParams.get('episode'));

	if (!season || !episodeNumber) error(400, 'season and episode are required');

	const episode = Episodes.find(season, episodeNumber);
	if (!episode) error(404, 'Episode not found');

	const startTimeParam = Number(url.searchParams.get('t'));
	const startTime = Number.isFinite(startTimeParam) && startTimeParam > 0 ? startTimeParam : 0;

	const [comments, videoUrl] = await Promise.all([
		locals.repos.episodeComments.list(season, episodeNumber),
		sign(buildVideoPath(season, episodeNumber)),
		locals.repos.watchHistory.record(locals.user.id, season, episodeNumber)
	]);

	return { episode, comments, videoUrl, startTime };
};
