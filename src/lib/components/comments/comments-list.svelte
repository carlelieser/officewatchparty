<script lang="ts">
	import * as Item from '$lib/components/ui/item';
	import * as Empty from '$lib/components/ui/empty';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { MessageSquare } from '@lucide/svelte';
	import { getCommentsContext } from './comments-context';

	const context = getCommentsContext();

	let containerEl: HTMLDivElement = $state(undefined!);
	let overflows = $state(false);

	const sorted = $derived(
		[...context.comments].sort((a, b) => {
			const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			return context.sort === 'newest' ? -diff : diff;
		})
	);

	const hasMore = $derived(overflows && !context.expanded);

	$effect(() => {
		context.comments;
		if (containerEl && !context.expanded) {
			overflows = containerEl.scrollHeight > containerEl.clientHeight;
		}
	});

	function initials(email: string) {
		return email.split('@')[0].slice(0, 2).toUpperCase();
	}

	function timeAgo(date: string) {
		const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
		if (seconds < 60) return 'just now';
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	}
</script>

<div class="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto">
	{#if context.comments.length === 0}
		<Empty.Root class="py-24">
			<Empty.Media>
				<MessageSquare class="text-muted-foreground" />
			</Empty.Media>
			<Empty.Title>No comments yet</Empty.Title>
			<Empty.Description>Be the first to say something.</Empty.Description>
		</Empty.Root>
	{:else}
		<div bind:this={containerEl} class="flex flex-col gap-2 relative" class:max-h-48={!context.expanded} class:overflow-hidden={!context.expanded}>
			{#each sorted as comment (comment.id)}
				<Item.Root variant="outline" class="rounded-2xl">
					<Item.Content class="gap-2">
						<Item.Title>{comment.content}</Item.Title>
						<Item.Description class="w-full flex flex-row items-center justify-between">
							<div class="flex flex-row items-center gap-2">
								<Avatar class="size-5 flex items-center justify-center">
									<AvatarFallback class="text-[10px]">{initials(comment.email)}</AvatarFallback>
								</Avatar>
								{comment.email.split('@')[0]}
							</div>
							<span class="text-xs font-normal">{timeAgo(comment.created_at)}</span>
						</Item.Description>
					</Item.Content>
				</Item.Root>
			{/each}
			{#if hasMore}
				<div
					class="w-full flex items-center justify-center sticky bottom-0 left-0 py-4 bg-gradient-to-t from-background to-transparent"
				>
					<Button variant="outline" size="sm" onclick={() => { context.expanded = true; }}>
						<span class="text-xs uppercase text-muted-foreground"
							>Show all {sorted.length} messages</span
						>
					</Button>
				</div>
			{/if}
		</div>
	{/if}
</div>
