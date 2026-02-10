<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import OfficeEpisodeSelect from '$lib/components/office-episode-select.svelte';
	import Favorites from '$lib/components/favorites.svelte';
	import type { Episode } from '$lib/components/episode-select.svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_STRIPE_PAYMENT_LINK } from '$env/static/public';

	let selected: Episode | null = $state(null);

	function onEpisodeSelect(ep: Episode) {
		goto(`/room/new?season=${ep.season}&episode=${ep.episode}`);
	}
</script>

<div
	class="w-full h-screen py-12 max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-8 p-4 *:flex"
>
	<div class="flex-col p-4 order-1 md:order-[unset]">
		{#if page.data.user}
			<div class="flex flex-col gap-4 m-auto">
				<h1 class="text-8xl font-bold font-display">Hello, superfan.</h1>
				<p>
					<span class="text-sm text-muted-foreground">Choose an episode to get started.</span>
					<Button href="#favorites" variant="link" class="!px-0">Or pick a favorite.</Button>
				</p>
				<div class="w-full">
					<OfficeEpisodeSelect bind:selected onchange={onEpisodeSelect} />
				</div>
			</div>
		{:else}
			<div class="flex flex-col gap-4 m-auto">
				<h1 class="text-7xl md:text-8xl font-bold font-display">Superfans only.</h1>
				<p>Invite friends & family. Watch extended episodes of The Office.</p>
				<div class="flex flex-row items-center gap-2">
					<Button variant="outline" href={PUBLIC_STRIPE_PAYMENT_LINK} target="_blank">
						Donate
					</Button>
					<Button href="/login">Get Started</Button>
				</div>
			</div>
		{/if}
	</div>
	<div>
		<video class="max-w-md m-auto" autoplay loop muted playsinline>
			<source src="/tv-animated.webm" type="video/webm" />
			<source src="/tv-animated.mp4" type="video/mp4" />
		</video>
	</div>
</div>

{#if page.data.user}
	<div id="favorites" class="w-full max-w-screen-lg mx-auto px-4 pb-12">
		<Favorites initial={page.data.favorites} onselect={onEpisodeSelect} />
	</div>
{/if}
