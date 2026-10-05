<script lang="ts">
	import type { Snippet } from 'svelte';

	interface GuidePageProps {
		children: Snippet;
	}

	let { children }: GuidePageProps = $props();
</script>

<div class="mx-auto flex w-full max-w-screen-md flex-col gap-6 px-4 py-12">
	{@render children()}
</div>
