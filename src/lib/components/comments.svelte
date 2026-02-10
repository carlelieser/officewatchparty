<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Item from '$lib/components/ui/item';
	import * as Empty from '$lib/components/ui/empty';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { ArrowDownUp, ArrowUp, ChevronsDownUp, MessageSquare } from '@lucide/svelte';

	type Comment = {
		id: string;
		user_id: string;
		email: string;
		content: string;
		created_at: string;
	};

	let {
		comments
	}: {
		comments: Comment[];
	} = $props();

	type Sort = 'newest' | 'oldest';

	const PAGE_SIZE = 5;

	let content = $state('');
	let submitting = $state(false);
	let sort: Sort = $state('newest');
	let limit = $state(PAGE_SIZE);
	let expanded = $state(false);

	const sorted = $derived(
		[...comments].sort((a, b) => {
			const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			return sort === 'newest' ? -diff : diff;
		})
	);

	const visible = $derived(expanded ? sorted : sorted.slice(0, limit));
	const hasMore = $derived(sorted.length > limit && !expanded);

	function showMore() {
		expanded = true;
	}

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

<div class="flex flex-col gap-2 p-4">
	{#if comments.length === 0 && !submitting}
		<Empty.Root>
			<Empty.Media>
				<MessageSquare class="text-muted-foreground" />
			</Empty.Media>
			<Empty.Title>No comments yet</Empty.Title>
			<Empty.Description>Be the first to say something.</Empty.Description>
		</Empty.Root>
	{:else}
		<div class="flex items-center justify-between sticky top-0 z-10 bg-background py-1">
			<span class="uppercase text-xs text-muted-foreground font-medium">Comments</span>
			<div class="flex items-center gap-1">
				{#if expanded}
					<Button
						variant="ghost"
						size="sm"
						onclick={() => {
							expanded = false;
						}}
					>
						<ChevronsDownUp size={14} />
						Collapse
					</Button>
				{/if}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="ghost" size="sm">
							<ArrowDownUp size={14} />
							{sort === 'newest' ? 'Newest' : 'Oldest'}
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Item onclick={() => (sort = 'newest')}>Newest first</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => (sort = 'oldest')}>Oldest first</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>

		<div class="overflow-hidden flex flex-col gap-1 relative" class:max-h-64={!expanded}>
			{#each visible as comment (comment.id)}
				<Item.Root variant="outline" size="sm" class="bg-card">
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
					class="w-full flex items-center justify-center absolute bottom-0 left-0 bg-gradient-to-t from-background to-transparent"
				>
					<Button variant="outline" size="sm" onclick={showMore}>
						<span class="text-xs uppercase text-muted-foreground"
							>Show all {sorted.length} messages</span
						>
					</Button>
				</div>
			{/if}
		</div>
	{/if}

	<form
		method="POST"
		action="?/comment"
		class="sticky bottom-0 py-1"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update();
				content = '';
				submitting = false;
			};
		}}
	>
		<InputGroup.Root class="bg-card rounded-2xl h-16 p-2">
			<InputGroup.Input
				bind:value={content}
				name="content"
				placeholder="Write a comment..."
				disabled={submitting}
			/>
			<InputGroup.Button
				type="submit"
				variant="ghost"
				class="!size-12 rounded-full flex items-center justify-center"
				disabled={submitting || !content.trim()}
			>
				{#if submitting}
					<Spinner size="sm" />
				{:else}
					<ArrowUp size={14} />
				{/if}
			</InputGroup.Button>
		</InputGroup.Root>
	</form>
</div>
