<script lang="ts">
	import * as Item from '$lib/components/ui/item';
	import { resolve } from '$app/paths';
	import EpisodeListItem from '$lib/features/episodes/components/episode-list-item.svelte';
	import { SeoHead, JsonLd, pageTitle, type SeoMeta, type Breadcrumb } from '$lib/features/seo';
	import {
		GuidePage,
		GuideBreadcrumbs,
		SeasonLinks,
		GUIDE_PATH,
		SERIES_NAME,
		seasonGuidePath,
		episodeGuidePath,
		seasonSchema
	} from '$lib/features/guide';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let heading = $derived(`${SERIES_NAME} Season ${data.season}`);

	let meta: SeoMeta = $derived({
		title: pageTitle(`${heading} Episodes`),
		description: `All ${data.episodes.length} episodes of ${heading}, from "${data.episodes[0].label}" onward, with a summary of each. Watch them together with friends.`,
		path: seasonGuidePath(data.season)
	});

	let schema = $derived(seasonSchema(data.season, data.episodes));

	let breadcrumbs: Array<Breadcrumb> = $derived([
		{ name: 'Home', path: resolve('/') },
		{ name: SERIES_NAME, path: resolve(GUIDE_PATH) },
		{ name: `Season ${data.season}`, path: resolve(seasonGuidePath(data.season)) }
	]);
</script>

<SeoHead {meta} />
<JsonLd document={schema} />

<GuidePage>
	<GuideBreadcrumbs {breadcrumbs} />

	<div class="flex flex-col gap-2">
		<h1 class="text-4xl font-bold font-display">{heading}</h1>
		<p class="text-muted-foreground">
			All {data.episodes.length} episodes of season {data.season}, with a short summary of each.
		</p>
	</div>

	<SeasonLinks seasonNumbers={data.seasonNumbers} currentSeason={data.season} />

	<Item.Group class="-mx-4">
		{#each data.episodes as episode (episode.episode)}
			<EpisodeListItem {episode} variant="default" href={resolve(episodeGuidePath(episode))} />
		{/each}
	</Item.Group>
</GuidePage>
