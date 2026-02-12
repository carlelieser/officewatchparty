<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group';
	import { Spinner } from '$lib/components/ui/spinner';
	import { ArrowUp } from '@lucide/svelte';
	import { getCommentsContext } from './comments-context';
	import { page } from '$app/state';
	import { postComment } from '$lib/features/comments/api';

	interface CommentsInputProps {
		roomAlias: string;
	}

	let { roomAlias }: CommentsInputProps = $props();

	const context = getCommentsContext();

	let content = $state('');
	let submitting = $state(false);

	function onKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') submit();
	}

	async function submit(): Promise<void> {
		if (submitting || !content.trim()) return;
		submitting = true;
		const trimmed = content.trim();
		try {
			await postComment(roomAlias, trimmed);
			context.channel?.send({
				type: 'broadcast',
				event: 'new_comment',
				payload: {
					id: crypto.randomUUID(),
					user_id: '',
					email: page.data.user?.email,
					content: trimmed,
					created_at: new Date().toISOString()
				}
			});
		} catch (submitError) {
			console.error(submitError);
		} finally {
			content = '';
			submitting = false;
		}
	}
</script>

<InputGroup.Root class="rounded-2xl h-16 p-2">
	<InputGroup.Input
		bind:value={content}
		placeholder="Write a comment..."
		disabled={submitting}
		onkeydown={onKeydown}
	/>
	<InputGroup.Button
		variant="ghost"
		class="size-12! rounded-full flex items-center justify-center"
		disabled={submitting || !content.trim()}
		onclick={submit}
	>
		{#if submitting}
			<Spinner size="sm" />
		{:else}
			<ArrowUp size={14} />
		{/if}
	</InputGroup.Button>
</InputGroup.Root>
