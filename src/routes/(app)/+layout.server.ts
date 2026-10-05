import type { LayoutServerLoad } from './$types';
import { resolve } from '$app/paths';
import { Episodes } from '$lib/server/episodes';

export const load: LayoutServerLoad = async ({ locals }) => {
	const [favoritePairs, latestWatch] = await Promise.all([
		locals.repos.favorites.findByUserId(locals.user.id),
		locals.repos.watchHistory.findLatest(locals.user.id)
	]);

	// Encoded as "season-episode" keys so any episode card can cheaply check
	// favorited state via page.data without its own query.
	const favoriteKeys = favoritePairs.map((favorite) => `${favorite.season}-${favorite.episode}`);

	// The sidebar "Watch" link resumes the most recent episode at its saved
	// timestamp, defaulting to the series premiere when nothing has been watched.
	const resume = latestWatch ?? { season: 1, episode: 1, progress_seconds: 0, duration_seconds: 0 };
	const resumeTime = Math.floor(resume.progress_seconds ?? 0);
	let watchHref = `${resolve('/watch')}?season=${resume.season}&episode=${resume.episode}`;
	if (resumeTime > 0) watchHref += `&t=${resumeTime}`;

	return { user: locals.user, episodes: Episodes.all, favoriteKeys, watchHref };
};
