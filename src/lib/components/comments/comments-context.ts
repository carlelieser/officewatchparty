import { getContext, setContext } from 'svelte';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Comment } from '$lib/types';

type Sort = 'newest' | 'oldest';

export interface CommentsState {
	sort: Sort;
	expanded: boolean;
	comments: Comment[];
	channel: RealtimeChannel | null;
}

const KEY = Symbol('comments');

export function setCommentsContext(state: CommentsState) {
	setContext(KEY, state);
}

export function getCommentsContext(): CommentsState {
	return getContext(KEY);
}
