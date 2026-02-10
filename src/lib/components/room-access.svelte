<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import * as Popover from '$lib/components/ui/popover';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import CopyButton from '$lib/components/copy-button.svelte';
	import * as Empty from '$lib/components/ui/empty';
	import { Link, Plus, Search, Users, X, ShareIcon } from '@lucide/svelte';

	let {
		alias,
		members,
		isOwner
	}: {
		alias: string;
		members: { user_id: string; email: string; created_at: string }[];
		isOwner: boolean;
	} = $props();

	let search = $state('');
	let addDialogOpen = $state(false);
	let email = $state('');

	const filtered = $derived(
		members.filter((m) => m.email.toLowerCase().includes(search.toLowerCase()))
	);
</script>

<Popover.Root>
	<Popover.Trigger class="cursor-pointer">
		<Button variant="outline" size="sm">
			<ShareIcon />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-72 p-0" align="start">
		<div class="flex items-center gap-2 p-3">
			<code class="bg-muted rounded px-2 py-1 text-xs font-mono select-all truncate">
				{page.url.origin}/room/{alias}
			</code>
			<CopyButton text="{page.url.origin}/room/{alias}" />
		</div>

		{#if isOwner}
			<Separator />

			<div class="p-2">
				<div class="relative">
					<Search
						size={14}
						class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
					/>
					<Input bind:value={search} placeholder="Search members..." class="h-8 pl-8 text-xs" />
				</div>
			</div>

			<div class="max-h-48 overflow-y-auto px-2">
				{#each filtered as member}
					<div
						class="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
					>
						<span class="truncate text-xs">{member.email}</span>
						<form method="POST" action="?/remove" use:enhance>
							<input type="hidden" name="user_id" value={member.user_id} />
							<Button variant="ghost" size="icon-sm" type="submit" class="size-6 shrink-0">
								<X size={12} />
							</Button>
						</form>
					</div>
				{:else}
					<Empty.Root class="py-4">
						<Empty.Media>
							<Users />
						</Empty.Media>
						<Empty.Title>{search ? 'No matches' : 'No members yet'}</Empty.Title>
						<Empty.Description>
							{search ? 'Try a different search' : 'Add someone to get started'}
						</Empty.Description>
					</Empty.Root>
				{/each}
			</div>

			<Separator />

			<div class="p-2">
				<Dialog.Root bind:open={addDialogOpen}>
					<Dialog.Trigger class="w-full">
						<Button variant="ghost" size="sm" class="w-full justify-start text-xs">
							<Plus size={14} />
							Add member
						</Button>
					</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Add member</Dialog.Title>
							<Dialog.Description>
								Enter the email of the user you want to invite.
							</Dialog.Description>
						</Dialog.Header>
						<form
							method="POST"
							action="?/add"
							use:enhance={() => {
								return async ({ update }) => {
									await update();
									email = '';
									addDialogOpen = false;
								};
							}}
						>
							<div class="flex flex-col gap-4">
								<Input
									bind:value={email}
									name="email"
									type="email"
									placeholder="user@example.com"
								/>
								<Dialog.Footer>
									<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
									<Button type="submit">Add</Button>
								</Dialog.Footer>
							</div>
						</form>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
