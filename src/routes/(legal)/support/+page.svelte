<script lang="ts">
	import ProsePage from '$lib/components/prose-page.svelte';
	import DonateButton from '$lib/components/donate-button.svelte';
	import { Button } from '$lib/components/ui/button';
	import StripeWordmark from '$lib/components/stripe-wordmark.svelte';
	import { HandCoinsIcon, ArrowUpRightIcon } from '@lucide/svelte';
	import { MONTHLY_COST_LABEL } from '$lib/shared/donation-costs';
</script>

<svelte:head>
	<title>Support the Party - OWP</title>
	<meta
		name="description"
		content="OfficeWatchParty is free and ad-free. Here's what it costs to run, and how to chip in."
	/>
</svelte:head>

<ProsePage title="Support the Party">
	<p>
		OfficeWatchParty is free, has no ads, and isn't trying to become a business. It's a side project
		that exists so people can watch <em>The Office</em>, together (or alone lol).
	</p>
	<p>It does, however, cost real money to keep online.</p>

	<h2>What it costs</h2>

	<table>
		<tbody>
			<tr>
				<td>Media server</td>
				<td>The box that actually holds and serves the episodes</td>
			</tr>
			<tr>
				<td>Database &amp; auth</td>
				<td>Rooms, comments, reactions, who's watching what</td>
			</tr>
			<tr>
				<td>Hosting</td>
				<td>The app itself, on Cloudflare</td>
			</tr>
			<tr>
				<td>Domain</td>
				<td>officewatchparty.com, once a year</td>
			</tr>
			<tr>
				<td><strong>Total</strong></td>
				<td><strong>~{MONTHLY_COST_LABEL}/month</strong></td>
			</tr>
		</tbody>
	</table>

	<p>
		That number is flat. It costs the same whether five people are watching or fifty — which means
		if a few regulars cover the bill, it stays free for everyone else.
	</p>

	<blockquote>
		Donate whatever you're comfortable with. A couple dollars here and there helps keep the project alive for everyone!
	</blockquote>

	<div class="not-prose my-8 flex flex-col items-center gap-3">
		<DonateButton>
			{#snippet child({ href })}
				<Button class="w-full sm:w-auto" size="lg" {href} target="_blank" rel="noopener noreferrer">
					<HandCoinsIcon />
					Support the Cause
					<ArrowUpRightIcon />
				</Button>
			{/snippet}
		</DonateButton>

		<p class="flex items-center gap-1.5 text-xs text-muted-foreground">
			Powered by
			<StripeWordmark class="h-4 w-auto" />
		</p>
	</div>
</ProsePage>
