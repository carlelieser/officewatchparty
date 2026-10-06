<script lang="ts">
	import LandingCtaButtons from './landing-cta-buttons.svelte';
	import { m } from '$lib/paraglide/messages';
</script>

<section aria-labelledby="final-cta-heading" class="w-full bg-muted/40 py-36">
	<div class="mx-auto flex w-full max-w-screen-lg flex-col items-center gap-8 px-6 text-center">
		<div class="flex flex-col gap-3">
			<h2
				id="final-cta-heading"
				class="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl"
			>
				{m.landing_final_cta_heading()}
			</h2>
			<p class="max-w-xl text-muted-foreground text-pretty">
				{m.landing_final_cta_description()}
			</p>
		</div>
		<LandingCtaButtons />
	</div>
</section>
