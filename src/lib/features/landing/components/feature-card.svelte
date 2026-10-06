<script lang="ts">
	import type { LandingFeature } from '../types';

	type Props = {
		feature: LandingFeature;
	};

	let { feature }: Props = $props();
</script>

<li class="flex flex-col gap-2 rounded-xl border p-5">
	<feature.icon class="size-5 text-primary" aria-hidden="true" />
	<h3 class="font-semibold">{feature.title}</h3>
	<p class="text-sm text-muted-foreground">{feature.description}</p>
</li>
