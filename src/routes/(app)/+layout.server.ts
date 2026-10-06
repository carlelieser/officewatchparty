import type { LayoutServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';
import type { ResumePoint } from '$lib/features/episodes/types';

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
	// Returned as data, not a URL: resolve() is page-relative during SSR.
	// https://svelte.dev/docs/kit/configuration#paths
	const latest = latestWatch ?? { season: 1, episode: 1, progress_seconds: 0 };
	const resume: ResumePoint = {
		season: latest.season,
		episode: latest.episode,
		timeSeconds: Math.floor(latest.progress_seconds ?? 0)
	};

	return { user: locals.user, episodes: Episodes.all, favoriteKeys, resume };
};
