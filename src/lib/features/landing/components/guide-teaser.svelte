<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRightIcon } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { GUIDE_PATH } from '$lib/features/guide';
	import FeaturedEpisodeCard from './featured-episode-card.svelte';
	import LandingSection from './landing-section.svelte';
	import type { Episode } from '$lib/features/episodes/types';
	import { m } from '$lib/paraglide/messages';

	interface GuideTeaserProps {
		episodes: Array<Episode>;
	}

	let { episodes }: GuideTeaserProps = $props();

	let hasEpisodes = $derived(episodes.length > 0);
</script>

{#if hasEpisodes}
	<LandingSection
		id="episode-guide"
		eyebrow={m.landing_guide_eyebrow()}
		heading={m.landing_guide_heading()}
		isMuted
	>
		<div class="flex flex-col gap-8">
			<ul class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
				{#each episodes as episode (`${episode.season}-${episode.episode}`)}
					<FeaturedEpisodeCard {episode} />
				{/each}
			</ul>
			<div class="flex justify-center">
				<Button variant="outline" size="lg" href={resolve(GUIDE_PATH)}>
					{m.landing_guide_browse_all()}
					<ArrowRightIcon aria-hidden="true" />
				</Button>
			</div>
		</div>
	</LandingSection>
{/if}
