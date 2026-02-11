<script lang="ts">
	import {Button} from '$lib/components/ui/button';
	import {page} from '$app/state';
	import OfficeEpisodeSelect from '$lib/components/office-episode-select.svelte';
	import Favorites from '$lib/components/favorites.svelte';
	import Rooms from '$lib/components/rooms.svelte';
	import TvAnimation from '$lib/components/tv-animation.svelte';
	import type {Episode} from '$lib/types';
	import {goto} from '$app/navigation';
	import {toast} from "svelte-sonner";

	let selected: Episode | null = $state(null);

	async function onEpisodeSelect(episode: Episode) {
		toast.loading("Prepping your room.")
		await goto(`/room/new?season=${episode.season}&episode=${episode.episode}`);
		toast.dismiss()
	}
</script>

<div
        class="w-full h-screen max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-8 p-4 py-12 *:p-4 *:flex"
>
    <div class="flex-col order-1 md:order-[unset]">
        <div class="flex flex-col gap-4 w-full mx-auto md:m-auto">
            <h1 class="text-6xl lg:text-8xl font-bold font-display">Hello, superfan.</h1>
            <p>
                <span class="text-sm text-muted-foreground">Choose an episode to get started.</span>
                <Button href="#favorites" variant="link" class="!px-0">Or pick a favorite.</Button>
            </p>
            <div class="w-full">
                <OfficeEpisodeSelect bind:selected onchange={onEpisodeSelect} class="w-full"/>
            </div>
        </div>
    </div>
    <div>
        <TvAnimation/>
    </div>
</div>

<div id="favorites" class="w-full max-w-screen-lg mx-auto px-4 pb-12">
    <Favorites initial={page.data.favorites} onselect={onEpisodeSelect}/>
</div>

<div class="w-full max-w-screen-lg mx-auto px-4 pb-12">
    <Rooms initial={page.data.rooms}/>
</div>
