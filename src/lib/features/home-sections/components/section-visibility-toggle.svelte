<script lang="ts">
	import { Eye, EyeOff } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	type SectionVisibilityToggleProps = {
		title: string;
		isHidden: boolean;
		isPending: boolean;
		onclick: () => void;
	};

	let { title, isHidden, isPending, onclick }: SectionVisibilityToggleProps = $props();

	let label = $derived(isHidden ? `Show ${title}` : `Hide ${title}`);
</script>

<!-- Revealed on header hover or keyboard focus; always shown where there is no hover. -->
<Button
	variant="ghost"
	size="icon-sm"
	aria-label={label}
	disabled={isPending}
	{onclick}
	class="text-muted-foreground opacity-0 transition-opacity group-hover/section-header:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
>
	{#if isHidden}
		<Eye />
	{:else}
		<EyeOff />
	{/if}
</Button>
