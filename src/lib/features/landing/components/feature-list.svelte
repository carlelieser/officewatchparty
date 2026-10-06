<script lang="ts">
	import { LANDING_FEATURES } from '../landing-features';
	import FeatureCard from './feature-card.svelte';
</script>

<section aria-labelledby="features-heading" class="flex flex-col gap-6">
	<h2 id="features-heading" class="text-3xl font-bold font-display">What you can do</h2>
	<ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each LANDING_FEATURES as feature (feature.title)}
			<FeatureCard {feature} />
		{/each}
	</ul>
</section>
