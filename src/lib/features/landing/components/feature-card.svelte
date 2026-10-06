<script lang="ts">
	import type { LandingFeature } from '../types';

	type Props = {
		feature: LandingFeature;
	};

	let { feature }: Props = $props();
</script>

<li
	class="flex flex-col gap-4 rounded-xl border bg-card p-6 transition-colors hover:border-muted-foreground/40"
>
	<span class="flex size-9 items-center justify-center rounded-full border bg-background">
		<feature.icon class="size-4 text-primary" aria-hidden="true" />
	</span>
	<div class="flex flex-col gap-1.5">
		<h3 class="font-semibold">{feature.title()}</h3>
		<p class="text-sm text-muted-foreground">{feature.description()}</p>
	</div>
</li>
