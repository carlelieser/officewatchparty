<script lang="ts">
	import type { Episode } from '$lib/types';
	import EpisodeSelect from '$lib/components/episode-select.svelte';

	interface OfficeEpisodeSelectProps {
		selected?: Episode | null;
		onchange?: (episode: Episode) => void;
		class?: string;
	}

	let { selected = $bindable<Episode | null>(null), onchange, class: className }: OfficeEpisodeSelectProps = $props();

	let episodes: Episode[] = $state([]);

	$effect(() => {
		fetch('/api/episodes')
			.then((r) => r.json())
			.then((data) => (episodes = data));
	});
</script>

<EpisodeSelect {episodes} bind:selected {onchange} class={className} />
