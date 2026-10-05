<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { HandCoinsIcon, ArrowUpRightIcon } from '@lucide/svelte';
	import TvAnimation from '$lib/components/tv-animation.svelte';
	import { resolve } from '$app/paths';
	import {
		SeoHead,
		JsonLd,
		SITE_NAME,
		SITE_ORIGIN,
		type SeoMeta,
		type JsonLdObject
	} from '$lib/features/seo';
	import { GUIDE_PATH } from '$lib/features/guide';

	const meta: SeoMeta = {
		title: `${SITE_NAME} — Watch The Office together`,
		description:
			'Watch The Office with friends in synced watch parties: shared playback, live reactions, and comments on every episode. Free and ad-free.',
		path: '/'
	};

	const websiteSchema: JsonLdObject = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: SITE_ORIGIN
	};
</script>

<SeoHead {meta} />
<JsonLd document={websiteSchema} />

<div
	class="w-full min-h-screen md:h-screen py-12 max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-8 p-4 *:flex"
>
	<div class="flex-col p-4 order-1 md:order-[unset]">
		<div class="flex flex-col gap-4 m-auto">
			<h1 class="leading-tight text-6xl font-bold font-display capitalize">
				The best way to watch The Office
			</h1>
			<p>Sign up, create a party, share, and enjoy!</p>
			<p class="text-sm text-muted-foreground">
				Not sure where to start? Browse the
				<Button variant="link" class="h-auto p-0" href={resolve(GUIDE_PATH)}>episode guide</Button>.
			</p>
			<div class="flex flex-row items-center gap-2 mt-4">
				<Button variant="outline" href="/support">
					<HandCoinsIcon />
					Support
				</Button>
				<Button href="/login">
					Watch Now
					<ArrowUpRightIcon />
				</Button>
			</div>
		</div>
	</div>
	<div>
		<TvAnimation />
	</div>
</div>
