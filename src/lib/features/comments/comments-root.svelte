<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CommentsRootProps {
		children: Snippet;
		class?: string;
	}

	let { children, class: className = '' }: CommentsRootProps = $props();
</script>

<div class="flex flex-col p-4 gap-2 {className}">
	{@render children()}
</div>
