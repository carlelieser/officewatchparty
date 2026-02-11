<script lang="ts">
	import { page } from '$app/state';
	import * as Popover from '$lib/components/ui/popover';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { Separator } from '$lib/components/ui/separator';
	import CopyButton from '$lib/components/copy-button.svelte';
	import * as Empty from '$lib/components/ui/empty';
	import { ChevronDown, Globe, Lock, Plus, Search, Users, X, ShareIcon } from '@lucide/svelte';

	import type { Member, Room } from '$lib/types';

	interface RoomAccessProps {
		alias: string;
		room: Room;
		members: Member[];
		isOwner: boolean;
	}

	let { alias, room, members, isOwner }: RoomAccessProps = $props();

	let search = $state('');
	let addDialogOpen = $state(false);
	let email = $state('');
	let accessType = $state(room.access_type);

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

			<div class="flex items-center justify-between px-3 py-2">
				<div class="flex items-center gap-2 text-xs text-muted-foreground">
					{#if accessType === 'link'}
						<Globe size={14} />
					{:else}
						<Lock size={14} />
					{/if}
					<span>General access</span>
				</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="ghost" size="sm" class="h-7 gap-1 text-xs">
							{accessType === 'link' ? 'Anyone with the link' : 'Restricted'}
							<ChevronDown size={12} />
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.RadioGroup
							value={accessType}
							onValueChange={(value) => {
								if (value === 'invite_only' || value === 'link') {
									accessType = value;
									fetch(`/api/rooms/${alias}/access-type`, {
										method: 'PUT',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({ access_type: value })
									});
								}
							}}
						>
							<DropdownMenu.RadioItem value="invite_only">Restricted</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem value="link">Anyone with the link</DropdownMenu.RadioItem>
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>

			<Separator />

			<div class="p-2">
				<InputGroup.Root>
					<InputGroup.Addon>
						<Search size={14} />
					</InputGroup.Addon>
					<InputGroup.Input bind:value={search} placeholder="Search members..." class="text-xs" />
				</InputGroup.Root>
			</div>

			<div class="max-h-48 overflow-y-auto px-2">
				{#each filtered as member}
					<div
						class="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted"
					>
						<span class="truncate text-xs">{member.email}</span>
						<Button
							variant="ghost"
							size="icon-sm"
							class="size-6 shrink-0"
							onclick={() => {
								fetch(`/api/rooms/${alias}/members`, {
									method: 'DELETE',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ user_id: member.user_id })
								});
								members = members.filter((m) => m.user_id !== member.user_id);
							}}
						>
							<X size={12} />
						</Button>
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
						<div class="flex flex-col gap-4">
							<Input bind:value={email} type="email" placeholder="user@example.com" />
							<Dialog.Footer>
								<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
								<Button
									onclick={async () => {
										await fetch(`/api/rooms/${alias}/members`, {
											method: 'POST',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify({ email })
										});
										email = '';
										addDialogOpen = false;
									}}>Add</Button
								>
							</Dialog.Footer>
						</div>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
