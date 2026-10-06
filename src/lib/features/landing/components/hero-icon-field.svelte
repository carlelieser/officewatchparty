<script lang="ts">
	import { HERO_ICONS, ICON_FIELD_CELL_SIZE, ICON_FIELD_RADIUS } from '../hero-icons';
	import { buildIconFieldCells, proximityTo } from '../icon-field-layout';
	import type { PointerPosition } from '../types';

	interface HeroIconFieldProps {
		pointer: PointerPosition | null;
	}

	let { pointer }: HeroIconFieldProps = $props();

	let width = $state(0);
	let height = $state(0);

	let cells = $derived(buildIconFieldCells(width, height, ICON_FIELD_CELL_SIZE, HERO_ICONS));
</script>

<div
	aria-hidden="true"
	bind:clientWidth={width}
	bind:clientHeight={height}
	class="pointer-events-none absolute inset-0 overflow-hidden text-foreground [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
>
	{#each cells as cell (cell.id)}
		<span
			class="icon-cell absolute size-7 motion-reduce:transition-none"
			style:left="{cell.x}px"
			style:top="{cell.y}px"
			style:--proximity={proximityTo(cell, pointer, ICON_FIELD_RADIUS)}
		>
			<cell.icon class="size-full" strokeWidth={1.5} />
		</span>
	{/each}
</div>

<style>
	.icon-cell {
		opacity: calc(0.14 + var(--proximity) * 0.56);
		transform: translate(-50%, -50%) rotate(45deg) scale(calc(0.75 + var(--proximity) * 0.75));
		transition:
			opacity 180ms ease-out,
			transform 180ms ease-out;
	}
</style>
