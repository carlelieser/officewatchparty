import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const season = Number(url.searchParams.get('season')) || 1;
	const episode = Number(url.searchParams.get('episode')) || 1;
	const alias = await locals.repos.rooms.create(locals.user.id, season, episode);

	redirect(303, `/room/${alias}`);
};
