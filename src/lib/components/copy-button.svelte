<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Check, Copy } from '@lucide/svelte';

	interface CopyButtonProps {
		text: string;
	}

	let { text }: CopyButtonProps = $props();

	let copied = $state(false);
	let timeout: ReturnType<typeof setTimeout>;

	function copy() {
		navigator.clipboard.writeText(text);
		clearTimeout(timeout);
		copied = true;
		timeout = setTimeout(() => (copied = false), 1000);
	}
</script>

<Button variant="ghost" size="icon-sm" onclick={copy}>
	{#if copied}
		<Check />
	{:else}
		<Copy />
	{/if}
</Button>
