<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Comment } from '$lib/types';
	import { setCommentsContext, type CommentsState } from './comments-context';

	interface CommentsProviderProps {
		children: Snippet;
		supabase: SupabaseClient;
		roomId: string;
		comments: Comment[];
	}

	let { children, supabase, roomId, comments }: CommentsProviderProps = $props();

	const state: CommentsState = $state({
		sort: 'newest' as 'newest' | 'oldest',
		expanded: false,
		comments,
		channel: null,
	});
	setCommentsContext(state);

	$effect(() => {
		const channel = supabase.channel(`comments:${roomId}`, {
			config: { broadcast: { self: true } }
		});

		channel.on('broadcast', { event: 'new_comment' }, (msg: { payload: Comment }) => {
			state.comments = [...state.comments, msg.payload];
		});

		channel.subscribe();
		state.channel = channel;

		return () => {
			channel.unsubscribe();
		};
	});
</script>

{@render children()}
