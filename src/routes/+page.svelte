<script lang="ts">
	import {
		SeoHead,
		JsonLd,
		SITE_NAME,
		SITE_ORIGIN,
		type SeoMeta,
		type JsonLdObject
	} from '$lib/features/seo';
	import {
		FeatureList,
		FinalCta,
		GuideTeaser,
		HowItWorks,
		LandingHero,
		SupportCallout
	} from '$lib/features/landing';
	import type { PageData } from './$types';
	import { m } from '$lib/paraglide/messages';

	let { data }: { data: PageData } = $props();

	const meta: SeoMeta = {
		title: m.landing_seo_title({ siteName: SITE_NAME }),
		description: m.landing_seo_description(),
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

<LandingHero heroEpisode={data.heroEpisode} />
<HowItWorks />
<FeatureList />
<GuideTeaser episodes={data.featuredEpisodes} />
<SupportCallout />
<FinalCta />
