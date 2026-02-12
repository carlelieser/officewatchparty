<script lang="ts">
	import type { Episode } from '$lib/features/episodes/types';
	import EpisodeSelect from '$lib/features/episodes/components/episode-select.svelte';
	import { page } from '$app/state';

	interface OfficeEpisodeSelectProps {
		selected?: Episode | null;
		onchange?: (episode: Episode) => void;
		disabled?: boolean;
		class?: string;
	}

	let {
		selected = $bindable<Episode | null>(null),
		onchange,
		disabled = false,
		class: className
	}: OfficeEpisodeSelectProps = $props();

	const episodes = $derived(page.data.episodes as Array<Episode>);
</script>

<EpisodeSelect {episodes} bind:selected {onchange} {disabled} class={className} />
