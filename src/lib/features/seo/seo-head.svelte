<script lang="ts">
	import { SITE_NAME, DEFAULT_IMAGE_PATH, absoluteUrl } from './site';
	import type { SeoMeta } from './types';

	interface SeoHeadProps {
		meta: SeoMeta;
	}

	let { meta }: SeoHeadProps = $props();

	let canonicalUrl = $derived(absoluteUrl(meta.path));
	let imageUrl = $derived(absoluteUrl(meta.image ?? DEFAULT_IMAGE_PATH));
	let openGraphType = $derived(meta.type ?? 'website');
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
	<link rel="canonical" href={canonicalUrl} />
	{#if meta.isHiddenFromSearch}
		<meta name="robots" content="noindex" />
	{/if}

	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content={openGraphType} />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={imageUrl} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={meta.title} />
	<meta name="twitter:description" content={meta.description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
