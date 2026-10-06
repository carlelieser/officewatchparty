<script lang="ts">
	import { ArrowUpRightIcon, HandCoinsIcon } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import DonateButton from '$lib/components/donate-button.svelte';
	import StripeWordmark from '$lib/components/stripe-wordmark.svelte';
	import { MONTHLY_COST_LABEL } from '$lib/shared/donation-costs';
	import { m } from '$lib/paraglide/messages';
</script>

<section aria-labelledby="support-heading" class="w-full py-20 sm:py-28">
	<div class="mx-auto w-full max-w-screen-lg px-6">
		<div
			class="grid items-center gap-8 rounded-2xl border bg-card p-8 sm:grid-cols-[1fr_auto] sm:p-10"
		>
			<div class="flex flex-col gap-3">
				<span class="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
					{m.landing_support_eyebrow()}
				</span>
				<h2 id="support-heading" class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
					{m.landing_support_heading()}
				</h2>
				<p class="max-w-xl text-muted-foreground text-pretty">
					{m.landing_support_description({ monthlyCost: MONTHLY_COST_LABEL })}
				</p>
			</div>
			<div class="flex flex-col items-start gap-3 sm:items-end">
				<DonateButton>
					{#snippet child({ href })}
						<Button size="lg" {href} target="_blank" rel="noopener noreferrer">
							<HandCoinsIcon aria-hidden="true" />
							{m.landing_support_donate()}
							<ArrowUpRightIcon aria-hidden="true" />
						</Button>
					{/snippet}
				</DonateButton>
				<p class="flex items-center gap-1.5 text-xs text-muted-foreground">
					{m.landing_support_powered_by()}
					<StripeWordmark class="h-4 w-auto" />
				</p>
			</div>
		</div>
	</div>
</section>
