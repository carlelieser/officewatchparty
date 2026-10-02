import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { Episodes } from '$lib/server/episodes';

export const load: LayoutServerLoad = async ({ params }) => {
	const season = Number(params.season);
	if (!Number.isInteger(season)) error(404, 'Season not found');

	const episodes = Episodes.forSeason(season);
	if (episodes.length === 0) error(404, 'Season not found');

	const seasonNumbers = Episodes.bySeason().map((entry) => entry.season);

	return { season, episodes, seasonNumbers };
};
