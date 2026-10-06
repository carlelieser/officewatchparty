<script lang="ts">
	import type { HowItWorksStep } from '../types';

	interface StepCardProps {
		step: HowItWorksStep;
		position: number;
	}

	let { step, position }: StepCardProps = $props();
</script>

<li
	class="flex flex-col gap-4 rounded-xl border bg-card p-6 transition-colors hover:border-muted-foreground/40"
>
	<div class="flex items-center justify-between">
		<span
			class="flex size-9 items-center justify-center rounded-full border bg-background font-display text-sm font-semibold tabular-nums"
		>
			{position}
		</span>
		<step.icon class="size-5 text-primary" aria-hidden="true" />
	</div>
	<div class="flex flex-col gap-1.5">
		<h3 class="font-semibold">{step.title()}</h3>
		<p class="text-sm text-muted-foreground">{step.description()}</p>
	</div>
</li>
