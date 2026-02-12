<script lang="ts">
	import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
	import * as Popover from '$lib/components/ui/popover';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Circle } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import { emailInitials, emailUsername } from '$lib/shared/user';

	interface RoomPresenceProps {
		supabase: SupabaseClient;
		roomId: string;
	}

	interface PresenceUser {
		email: string;
	}

	let { supabase, roomId }: RoomPresenceProps = $props();

	let users: Array<PresenceUser> = $state([]);
	let channel: RealtimeChannel | undefined;

	function handlePresenceSync(): void {
		const state = channel!.presenceState<PresenceUser>();
		const seen = new Set<string>();
		const list: Array<PresenceUser> = [];
		for (const key of Object.keys(state)) {
			if (!seen.has(key)) {
				seen.add(key);
				list.push({ email: key });
			}
		}
		users = list;
	}

	async function handleChannelSubscribed(): Promise<void> {
		await channel!.track({ email: page.data.user?.email });
	}

	$effect(() => {
		channel = supabase.channel(`room:${roomId}`, {
			config: { presence: { key: page.data.user?.email } }
		});

		channel
			.on('presence', { event: 'sync' }, handlePresenceSync)
			.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					await handleChannelSubscribed();
				}
			});

		return () => {
			channel?.unsubscribe();
		};
	});

	const MAX_VISIBLE = 3;
	const visible = $derived(users.slice(0, MAX_VISIBLE));
	const overflow = $derived(Math.max(0, users.length - MAX_VISIBLE));
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" class="h-8 gap-1 px-1!">
				<div class="flex flex-row -space-x-2">
					{#each visible as user (user.email)}
						<Avatar class="size-6">
							<AvatarFallback class="text-[10px]">{emailInitials(user.email)}</AvatarFallback>
						</Avatar>
					{/each}
				</div>
				{#if overflow > 0}
					<span class="text-xs text-muted-foreground">+{overflow}</span>
				{/if}
				<Circle class="mr-1 size-2 fill-green-500 text-green-500 animate-pulse" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-56 p-0" align="start">
		<div class="px-3 py-2">
			<span class="text-xs font-medium uppercase text-muted-foreground"
				>Online — {users.length}</span
			>
		</div>
		<div class="max-h-48 overflow-y-auto px-2 pb-2">
			{#each users as user (user.email)}
				<div class="flex items-center gap-2 rounded-md px-2 py-1.5">
					<Avatar class="size-6">
						<AvatarFallback class="text-[10px]">{emailInitials(user.email)}</AvatarFallback>
					</Avatar>
					<span class="truncate text-sm">{emailUsername(user.email)}</span>
					{#if user.email === page.data.user?.email}
						<span class="text-xs text-muted-foreground ml-auto">(you)</span>
					{/if}
				</div>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
