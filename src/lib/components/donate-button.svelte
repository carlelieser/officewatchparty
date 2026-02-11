<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { PUBLIC_STRIPE_PAYMENT_LINK } from '$env/static/public';
	import { HandCoinsIcon } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface DonateButtonProps {
		child?: Snippet<[{ href: string }]>;
	}

	let { child }: DonateButtonProps = $props();
</script>

{#if child}
	{@render child({ href: PUBLIC_STRIPE_PAYMENT_LINK })}
{:else}
	<Button variant="secondary" size="icon-sm" href={PUBLIC_STRIPE_PAYMENT_LINK} target="_blank">
		<HandCoinsIcon />
	</Button>
{/if}
