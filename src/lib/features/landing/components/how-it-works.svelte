<script lang="ts">
	import { HOW_IT_WORKS_STEPS } from '../how-it-works-steps';
	import LandingSection from './landing-section.svelte';
	import StepCard from './step-card.svelte';
	import { m } from '$lib/paraglide/messages';
</script>

<LandingSection
	id="how-it-works"
	eyebrow={m.landing_how_it_works_eyebrow()}
	heading={m.landing_how_it_works_heading()}
	description={m.landing_how_it_works_description()}
	isMuted
>
	<ol class="grid gap-4 sm:grid-cols-3">
		{#each HOW_IT_WORKS_STEPS as step, index (step.title)}
			<StepCard {step} position={index + 1} />
		{/each}
	</ol>
</LandingSection>
