<script lang="ts">
	import * as Item from '$lib/components/ui/item';
	import { ChevronRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { SeoHead, JsonLd, pageTitle, type SeoMeta } from '$lib/features/seo';
	import {
		GuidePage,
		GuideBreadcrumbs,
		GUIDE_PATH,
		SERIES_NAME,
		seasonGuidePath,
		seriesSchema
	} from '$lib/features/guide';
	import type { Breadcrumb } from '$lib/features/seo';
	import type { Season } from '$lib/features/episodes/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let episodeCount = $derived(
		data.seasons.reduce((total, season) => total + season.episodes.length, 0)
	);

	let meta: SeoMeta = $derived({
		title: pageTitle(`${SERIES_NAME} Episode Guide: All ${data.seasons.length} Seasons`),
		description: `Every episode of ${SERIES_NAME}, season by season: all ${episodeCount} episodes. Pick one and start a watch party with friends.`,
		path: GUIDE_PATH
	});

	let schema = $derived(seriesSchema(data.seasons));

	const breadcrumbs: Array<Breadcrumb> = [
		{ name: 'Home', path: resolve('/') },
		{ name: SERIES_NAME, path: resolve(GUIDE_PATH) }
	];

	function seasonSummary(season: Season): string {
		const first = season.episodes[0];
		const last = season.episodes[season.episodes.length - 1];
		return `${season.episodes.length} episodes · ${first.label} to ${last.label}`;
	}
</script>

<SeoHead {meta} />
<JsonLd document={schema} />

<GuidePage>
	<GuideBreadcrumbs {breadcrumbs} />

	<h1 class="text-4xl font-bold font-display">{SERIES_NAME} Episode Guide</h1>

	<Item.Group class="gap-2">
		{#each data.seasons as season (season.season)}
			<Item.Root variant="outline">
				{#snippet child({ props })}
					<a href={resolve(seasonGuidePath(season.season))} {...props}>
						<Item.Content>
							<Item.Title>
								<h2>Season {season.season}</h2>
							</Item.Title>
							<Item.Description>{seasonSummary(season)}</Item.Description>
						</Item.Content>
						<Item.Actions>
							<ChevronRight class="size-4" aria-hidden="true" />
						</Item.Actions>
					</a>
				{/snippet}
			</Item.Root>
		{/each}
	</Item.Group>
</GuidePage>
