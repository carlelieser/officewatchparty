<script lang="ts">
	import * as Empty from '$lib/components/ui/empty';
	import EpisodeCard from '$lib/features/episodes/components/episode-card.svelte';
	import type { OwnedRoom } from '$lib/features/rooms/types';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Plus, Tv, Users } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { deleteRoom } from '$lib/features/rooms/api';

	interface RoomsProps {
		initial?: Array<OwnedRoom>;
		showHeading?: boolean;
	}

	let { initial = [], showHeading = true }: RoomsProps = $props();

	let rooms: Array<OwnedRoom> = $state(initial);

	function remove(index: number, clickEvent: Event): void {
		clickEvent.stopPropagation();
		const room = rooms[index];
		rooms = rooms.filter((_, filterIndex) => filterIndex !== index);
		deleteRoom(room.alias);
	}

	function formatGuests(count: number): string {
		return `${count} ${count === 1 ? 'guest' : 'guests'}`;
	}
</script>

<div class="flex flex-col gap-3 w-full">
	{#if showHeading}
		<span class="text-center md:text-left text-xs font-medium uppercase text-muted-foreground"
			>Your Rooms</span
		>
	{/if}
	{#if rooms.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
			{#each rooms as room, index (room.alias)}
				<EpisodeCard
					season={room.season}
					episode={room.episode}
					label={room.label}
					onclick={() => goto(resolve(`/room/${room.alias}`))}
					onremove={(clickEvent) => remove(index, clickEvent)}
				>
					{#snippet footer()}
						<Badge variant="secondary">
							<Users class="size-3" />
							{formatGuests(room.guests)}
						</Badge>
					{/snippet}
				</EpisodeCard>
			{/each}
			<button
				class="aspect-[2/1] flex items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors cursor-pointer"
				onclick={() => goto(resolve('/room/new'))}
			>
				<Plus class="size-5 text-muted-foreground/50" />
			</button>
		</div>
	{:else}
		<Empty.Root>
			<Empty.Content>
				<Empty.Media>
					<Tv class="size-8 text-muted-foreground" />
				</Empty.Media>
				<Empty.Title>No rooms yet</Empty.Title>
				<Empty.Description>Create a room to start watching with friends.</Empty.Description>
				<Button variant="outline" size="sm" onclick={() => goto(resolve('/room/new'))}>
					<Plus class="size-4" />
					Create a room
				</Button>
			</Empty.Content>
		</Empty.Root>
	{/if}
</div>
