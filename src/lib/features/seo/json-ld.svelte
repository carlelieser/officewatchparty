<script lang="ts">
	import { jsonLdScript } from './json-ld';
	import type { JsonLdObject } from './types';

	interface JsonLdProps {
		document: JsonLdObject;
	}

	let { document }: JsonLdProps = $props();

	let script = $derived(jsonLdScript(document));
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- serializeJsonLd escapes `<`, so the markup can't break out of the script tag -->
	{@html script}
</svelte:head>
