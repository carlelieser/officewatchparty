<script lang="ts">
	import EpisodeSelect, { type Episode } from '$lib/components/episode-select.svelte';
	import { episodes } from '$lib/data/episodes';

	let {
		selected = $bindable<Episode | null>(null),
		onchange
	}: {
		selected?: Episode | null;
		onchange?: (episode: Episode) => void;
	} = $props();
</script>

<EpisodeSelect {episodes} bind:selected {onchange} />
