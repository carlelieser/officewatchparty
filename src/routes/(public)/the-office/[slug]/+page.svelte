<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { PlayIcon } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { SeoHead, JsonLd, pageTitle, type SeoMeta, type Breadcrumb } from '$lib/features/seo';
	import {
		GuidePage,
		GuideBreadcrumbs,
		EpisodePager,
		GUIDE_PATH,
		SERIES_NAME,
		seasonGuidePath,
		episodeGuidePath,
		episodeSchema,
		watchQuery
	} from '$lib/features/guide';
	import { episodeThumbnailUrl, formatEpisodeCode, formatSeasonEpisode } from '$lib/shared/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let episodeCode = $derived(formatEpisodeCode(data.episode.season, data.episode.episode));
	let metadata = $derived(formatSeasonEpisode(data.episode.season, data.episode.episode));
	let thumbnailUrl = $derived(episodeThumbnailUrl(data.episode.season, data.episode.episode));
	let watchHref = $derived(`${resolve('/watch')}?${watchQuery(data.episode)}`);

	let meta: SeoMeta = $derived({
		title: pageTitle(`${data.episode.label} (${SERIES_NAME} ${episodeCode})`),
		description: data.episode.description,
		path: episodeGuidePath(data.episode),
		image: thumbnailUrl,
		type: 'video.episode'
	});

	let schema = $derived(episodeSchema(data.episode));

	let breadcrumbs: Array<Breadcrumb> = $derived([
		{ name: 'Home', path: resolve('/') },
		{ name: SERIES_NAME, path: resolve(GUIDE_PATH) },
		{ name: `Season ${data.episode.season}`, path: resolve(seasonGuidePath(data.episode.season)) },
		{ name: data.episode.label, path: resolve(episodeGuidePath(data.episode)) }
	]);
</script>

<SeoHead {meta} />
<JsonLd document={schema} />

<GuidePage>
	<GuideBreadcrumbs {breadcrumbs} />

	<div class="flex flex-col gap-1">
		<p class="text-sm text-muted-foreground">{SERIES_NAME} · {metadata}</p>
		<h1 class="text-4xl font-bold font-display">{data.episode.label}</h1>
	</div>

	<div class="relative aspect-[2/1] overflow-hidden rounded-xl border bg-muted">
		<Skeleton class="absolute inset-0 size-full rounded-none" />
		<img
			src={thumbnailUrl}
			alt={`${data.episode.label}, ${SERIES_NAME} ${episodeCode}`}
			width="640"
			height="320"
			fetchpriority="high"
			class="relative size-full object-cover"
		/>
	</div>

	<p class="text-lg leading-relaxed">{data.episode.description}</p>

	<div>
		<Button size="lg" href={watchHref}>
			<PlayIcon />
			Watch with friends
		</Button>
	</div>

	<EpisodePager previous={data.previous} next={data.next} />
</GuidePage>
