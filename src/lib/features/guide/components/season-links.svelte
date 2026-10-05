<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { resolve } from '$app/paths';
	import { seasonGuidePath } from '../paths';

	interface SeasonLinksProps {
		seasonNumbers: Array<number>;
		currentSeason?: number;
	}

	let { seasonNumbers, currentSeason }: SeasonLinksProps = $props();
</script>

<nav aria-label="Seasons">
	<ul class="flex flex-wrap gap-2">
		{#each seasonNumbers as season (season)}
			{@const isCurrent = season === currentSeason}
			<li>
				<Button
					size="sm"
					variant={isCurrent ? 'default' : 'outline'}
					href={resolve(seasonGuidePath(season))}
					aria-current={isCurrent ? 'page' : undefined}
				>
					Season {season}
				</Button>
			</li>
		{/each}
	</ul>
</nav>
