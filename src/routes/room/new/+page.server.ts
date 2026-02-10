import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		redirect(303, '/login');
	}

	const season = Number(url.searchParams.get('season')) || null;
	const episode = Number(url.searchParams.get('episode')) || null;

	const insert: Record<string, unknown> = { owner_id: user.id };
	if (season && episode) {
		insert.season = season;
		insert.episode = episode;
	}

	const { data, error } = await locals.supabase
		.from('rooms')
		.insert(insert)
		.select('alias')
		.single();

	console.log(error);

	if (error || !data) {
		redirect(303, '/');
	}

	redirect(303, `/room/${data.alias}`);
};
