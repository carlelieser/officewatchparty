<script lang="ts">
	import RoomAccess from '$lib/components/room-access.svelte';
	import RoomPresence from '$lib/components/room-presence.svelte';
	import * as Comments from '$lib/components/comments';
	import OfficeEpisodeSelect from '$lib/components/office-episode-select.svelte';
	import VideoPlayer from '$lib/components/video-player.svelte';
	import type {Episode} from '$lib/types';

	let {data} = $props();
	let episode: Episode | null = $state(data ? data.episode : null);
	let videoUrl = $derived(episode ? `/season/${episode.season}/episode/${episode.episode}` : '');

	function onEpisodeChange(ep: Episode) {
		fetch(`/api/rooms/${data.room.alias}/episode`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({season: ep.season, episode: ep.episode})
		});
	}
</script>

<Comments.Provider
		supabase={data.supabase}
		roomId={data.room.id}
		comments={data.comments}
>
	<div class="size-full p-2">
		<div class="max-w-screen-xl mx-auto size-full flex flex-col">
			<div class="p-4 flex">
				<div class="flex items-center gap-2 mx-auto min-w-0 max-w-full">
					<OfficeEpisodeSelect bind:selected={episode} onchange={onEpisodeChange} class="flex-1 shrink"/>
					<RoomAccess alias={data.room.alias} room={data.room} members={data.members} isOwner={data.isOwner}/>
					<RoomPresence
							supabase={data.supabase}
							roomId={data.room.id}
							userEmail={data.user?.email ?? ''}
					/>
				</div>
			</div>
			<div class="px-4">
				<div class="bg-black rounded-2xl overflow-hidden aspect-square md:aspect-video">
					<VideoPlayer supabase={data.supabase} room={data.room} isOwner={data.isOwner} {videoUrl}/>
				</div>
			</div>
			<Comments.Header class="px-4 mt-4 top-18 py-4 pt-6"/>
			<Comments.Root class="flex-1 min-h-0 py-4">
				<Comments.Input roomAlias={data.room.alias}/>
				<Comments.List/>
			</Comments.Root>
		</div>
	</div>
</Comments.Provider>
