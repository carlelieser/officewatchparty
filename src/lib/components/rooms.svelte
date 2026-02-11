<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Empty from '$lib/components/ui/empty';
	import type {OwnedRoom} from '$lib/types';
	import {Button} from '$lib/components/ui/button';
	import {Badge} from '$lib/components/ui/badge';
	import {Plus, Tv, Users, X} from '@lucide/svelte';
	import {goto} from '$app/navigation';

	interface RoomsProps {
		initial?: OwnedRoom[];
	}

	let {initial = []}: RoomsProps = $props();

	let rooms: OwnedRoom[] = $state(initial);

	const pad = (n: number) => String(n).padStart(2, '0');

	function remove(index: number, e: Event) {
		e.stopPropagation();
		const room = rooms[index];
		rooms = rooms.filter((_, i) => i !== index);
		fetch(`/api/rooms/${room.alias}`, {method: 'DELETE'});
	}
</script>

<div class="flex flex-col gap-3 w-full">
	<span class="text-center md:text-left text-xs font-medium uppercase text-muted-foreground">Your Rooms</span>
	{#if rooms.length > 0}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
			{#each rooms as room, i}
				<div class="relative group">
					<button class="w-full text-left cursor-pointer" onclick={() => goto(`/room/${room.alias}`)}>
						<Card.Root class="aspect-square hover:bg-accent transition-colors">
							<Card.Header>
								<Card.Title class="font-display">{room.label}</Card.Title>
								<span class="text-xs font-mono text-muted-foreground"
								>S{pad(room.season)}E{pad(room.episode)}</span
								>
							</Card.Header>
							<Card.Content class="flex-1"></Card.Content>
							<Card.Footer class="flex justify-end">
								<Badge variant="secondary">
									<Users class="size-3"/>
									{room.guests} {room.guests === 1 ? 'guest' : 'guests'}
								</Badge>
							</Card.Footer>
						</Card.Root>
					</button>
					<button
							class="absolute top-2 right-2 size-5 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
							onclick={(e) => remove(i, e)}
					>
						<X class="size-3"/>
					</button>
				</div>
			{/each}
			<button
					class="aspect-square flex items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 transition-colors cursor-pointer"
					onclick={() => goto('/room/new')}
			>
				<Plus class="size-5 text-muted-foreground/50"/>
			</button>
		</div>
	{:else}
		<Empty.Root>
			<Empty.Content>
				<Empty.Media>
					<Tv class="size-8 text-muted-foreground"/>
				</Empty.Media>
				<Empty.Title>No rooms yet</Empty.Title>
				<Empty.Description>Create a room to start watching with friends.</Empty.Description>
				<Button variant="outline" size="sm" onclick={() => goto('/room/new')}>
					<Plus class="size-4"/>
					Create a room
				</Button>
			</Empty.Content>
		</Empty.Root>
	{/if}
</div>
