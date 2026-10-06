<script lang="ts">
	import { MOCK_REACTIONS } from '../room-mockup-data';
</script>

<div class="pointer-events-none absolute inset-x-0 bottom-0 h-28">
	{#each MOCK_REACTIONS as reaction (reaction.emoji)}
		<span
			class="reaction-chip absolute bottom-3 rounded-full border bg-background/90 px-2 py-0.5 text-sm shadow-sm backdrop-blur sm:px-2.5 sm:py-1 sm:text-base"
			style="left: {reaction.leftPercent}%; --reaction-delay: {reaction.delaySeconds}s"
		>
			{reaction.emoji}
		</span>
	{/each}
</div>

<style>
	.reaction-chip {
		opacity: 0;
		animation: reaction-float 6s ease-in-out infinite;
		animation-delay: var(--reaction-delay);
	}

	@keyframes reaction-float {
		0% {
			opacity: 0;
			transform: translateY(0.75rem) scale(0.9);
		}
		12% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
		38% {
			opacity: 1;
			transform: translateY(-1.25rem) scale(1);
		}
		50%,
		100% {
			opacity: 0;
			transform: translateY(-2rem) scale(0.95);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.reaction-chip {
			opacity: 1;
			animation: none;
		}
	}
</style>
