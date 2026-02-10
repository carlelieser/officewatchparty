import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { episodes } from '$lib/data/episodes';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		error(401, 'Unauthorized');
	}

	const { data: room, error: roomError } = await locals.supabase
		.from('rooms')
		.select('*')
		.eq('alias', params.id)
		.single();

	if (roomError || !room) {
		error(404, 'Room not found');
	}

	const isOwner = room.owner_id === user.id;

	let members: { user_id: string; email: string; created_at: string }[] = [];

	if (isOwner) {
		const { data } = await locals.supabase.rpc('get_room_members', { p_room_id: room.id });
		members = data ?? [];
	}

	const episode =
		episodes.find((e) => e.season === room.season && e.episode === room.episode) ?? null;

	const { data: comments } = await locals.supabase.rpc('get_room_comments', { p_room_id: room.id });

	return { room, members, isOwner, episode, comments: comments ?? [] };
};

export const actions: Actions = {
	add: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim();

		if (!email) return fail(400, { error: 'Email is required' });

		const { data: room } = await locals.supabase
			.from('rooms')
			.select('id')
			.eq('alias', params.id)
			.single();

		if (!room) return fail(404, { error: 'Room not found' });

		const { error: rpcError } = await locals.supabase.rpc('grant_room_access', {
			p_room_id: room.id,
			p_email: email
		});

		if (rpcError) {
			return fail(400, { error: rpcError.message });
		}
	},

	episode: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const season = Number(formData.get('season'));
		const episode = Number(formData.get('episode'));

		if (!season || !episode) return fail(400, { error: 'Season and episode are required' });

		const { error: updateError } = await locals.supabase
			.from('rooms')
			.update({ season, episode })
			.eq('alias', params.id);

		if (updateError) {
			return fail(400, { error: updateError.message });
		}
	},

	comment: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const content = formData.get('content')?.toString().trim();

		if (!content) return fail(400, { error: 'Content is required' });

		const { data: room } = await locals.supabase
			.from('rooms')
			.select('id')
			.eq('alias', params.id)
			.single();

		if (!room) return fail(404, { error: 'Room not found' });

		const { error: insertError } = await locals.supabase
			.from('comments')
			.insert({ room_id: room.id, user_id: user.id, content });

		if (insertError) {
			return fail(400, { error: insertError.message });
		}
	},

	player: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const is_playing = formData.get('is_playing') === 'true';
		const player_time = Number(formData.get('player_time')) || 0;

		const { error: updateError } = await locals.supabase
			.from('rooms')
			.update({ is_playing, player_time, player_updated_at: new Date().toISOString() })
			.eq('alias', params.id)
			.eq('owner_id', user.id);

		if (updateError) {
			return fail(400, { error: updateError.message });
		}
	},

	remove: async ({ request, locals, params }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const userId = formData.get('user_id')?.toString();

		if (!userId) return fail(400, { error: 'User ID is required' });

		const { data: room } = await locals.supabase
			.from('rooms')
			.select('id')
			.eq('alias', params.id)
			.single();

		if (!room) return fail(404, { error: 'Room not found' });

		const { error: deleteError } = await locals.supabase
			.from('room_access')
			.delete()
			.eq('room_id', room.id)
			.eq('user_id', userId);

		if (deleteError) {
			return fail(400, { error: deleteError.message });
		}
	}
};
