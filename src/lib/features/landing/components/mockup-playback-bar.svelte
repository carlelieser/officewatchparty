<script lang="ts">
	import { PauseIcon } from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { MOCK_PLAYBACK } from '../room-mockup-data';
	import { m } from '$lib/paraglide/messages';
</script>

<div class="flex items-center gap-3 px-1 pt-3 pb-1">
	<span
		class="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
	>
		<PauseIcon class="size-3.5 fill-current" aria-hidden="true" />
	</span>
	<div
		class="playhead-track h-1.5 flex-1 overflow-hidden rounded-full bg-muted-foreground/20"
		style="--progress: {MOCK_PLAYBACK.progressPercent}%"
	>
		<div class="playhead-fill h-full rounded-full bg-foreground"></div>
	</div>
	<span class="hidden text-xs text-muted-foreground tabular-nums sm:inline">
		{MOCK_PLAYBACK.elapsedLabel} / {MOCK_PLAYBACK.durationLabel}
	</span>
	<Badge variant="secondary" class="gap-1.5">
		<span class="size-1.5 rounded-full bg-foreground animate-pulse motion-reduce:animate-none"
		></span>
		{m.landing_mockup_synced()}
	</Badge>
</div>

<style>
	.playhead-fill {
		width: var(--progress);
		animation: playhead-advance 24s linear infinite alternate;
	}

	@keyframes playhead-advance {
		from {
			width: 34%;
		}
		to {
			width: 58%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.playhead-fill {
			animation: none;
		}
	}
</style>
