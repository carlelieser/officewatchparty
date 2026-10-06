<script lang="ts">
	import { LANDING_FEATURES } from '../landing-features';
	import FeatureCard from './feature-card.svelte';
	import LandingSection from './landing-section.svelte';
	import { m } from '$lib/paraglide/messages';
</script>

<LandingSection
	id="features"
	eyebrow={m.landing_features_eyebrow()}
	heading={m.landing_features_heading()}
	description={m.landing_features_description()}
>
	<ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each LANDING_FEATURES as feature (feature.title)}
			<FeatureCard {feature} />
		{/each}
	</ul>
</LandingSection>
