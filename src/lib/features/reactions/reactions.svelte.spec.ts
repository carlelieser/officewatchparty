import type { SupabaseClient } from '@supabase/supabase-js';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Reactions from './reactions.svelte';
import type { ReactionCount } from './types';

type FakeChannel = {
	on: () => FakeChannel;
	subscribe: () => FakeChannel;
	unsubscribe: () => void;
	send: () => void;
};

function createFakeChannel(): FakeChannel {
	const channel: FakeChannel = {
		on: () => channel,
		subscribe: () => channel,
		unsubscribe: () => {},
		send: () => {}
	};
	return channel;
}

function createFakeSupabase(): SupabaseClient {
	const client = { channel: createFakeChannel };
	return client as unknown as SupabaseClient;
}

async function fetchCounts(): Promise<Array<ReactionCount>> {
	return [{ emoji: '🔥', count: 2 }];
}

async function fetchUserReactions(): Promise<Array<string>> {
	return [];
}

function ignoreReactionChange(): void {}

describe('Reactions', () => {
	it('highlights a reaction after the user adds it', async () => {
		render(Reactions, {
			supabase: createFakeSupabase(),
			channelKey: 'test',
			season: 1,
			episode: 1,
			fetchCounts,
			fetchUserReactions,
			onAdd: ignoreReactionChange,
			onRemove: ignoreReactionChange
		});

		const reaction = page.getByRole('button', { name: /🔥/ });
		await expect.element(reaction).toHaveTextContent('2');
		await expect.element(reaction).not.toHaveClass('border');

		await reaction.click();

		await expect.element(reaction).toHaveTextContent('3');
		await expect.element(reaction).toHaveClass('border');
	});
});
