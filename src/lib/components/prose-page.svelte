<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ProsePageProps {
		title: string;
		lastUpdated: string;
		children: Snippet;
	}

	let { title, lastUpdated, children }: ProsePageProps = $props();
</script>

<div class="mx-auto w-full max-w-screen-md px-4 py-12">
	<article class="prose dark:prose-invert max-w-none">
		<h1>{title}</h1>
		<p class="text-muted-foreground text-sm">Last updated: {lastUpdated}</p>
		{@render children()}
	</article>
</div>
