import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { episodes } from '$lib/data/episodes';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) return { favorites: [] };

	const { data } = await locals.supabase
		.from('favorites')
		.select('season, episode')
		.eq('user_id', user.id)
		.order('created_at');

	const favorites = (data ?? []).map((f) => {
		const ep = episodes.find((e) => e.season === f.season && e.episode === f.episode);
		return (
			ep ?? {
				season: f.season,
				episode: f.episode,
				label: `S${f.season}E${f.episode}`,
				description: ''
			}
		);
	});

	return { favorites };
};

export const actions: Actions = {
	addFavorite: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const season = Number(formData.get('season'));
		const episode = Number(formData.get('episode'));

		if (!season || !episode) return fail(400, { error: 'Season and episode are required' });

		const { error } = await locals.supabase
			.from('favorites')
			.insert({ user_id: user.id, season, episode });

		if (error) return fail(400, { error: error.message });
	},

	removeFavorite: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const season = Number(formData.get('season'));
		const episode = Number(formData.get('episode'));

		if (!season || !episode) return fail(400, { error: 'Season and episode are required' });

		const { error } = await locals.supabase
			.from('favorites')
			.delete()
			.eq('user_id', user.id)
			.eq('season', season)
			.eq('episode', episode);

		if (error) return fail(400, { error: error.message });
	}
};
