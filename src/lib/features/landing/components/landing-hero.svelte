<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import LandingCtaButtons from './landing-cta-buttons.svelte';
	import RoomMockup from './room-mockup.svelte';
	import HeroIconField from './hero-icon-field.svelte';
	import type { Episode } from '$lib/features/episodes/types';
	import type { PointerPosition } from '../types';
	import { m } from '$lib/paraglide/messages';

	interface LandingHeroProps {
		heroEpisode: Episode | null;
	}

	let { heroEpisode }: LandingHeroProps = $props();

	const ENTRANCE_CLASS =
		'animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both motion-reduce:animate-none';

	let pointer: PointerPosition | null = $state(null);
	let pendingFrame: number | null = null;

	function handlePointerMove(event: PointerEvent): void {
		const section = event.currentTarget as HTMLElement;
		const bounds = section.getBoundingClientRect();
		const next: PointerPosition = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
		if (pendingFrame !== null) return;
		pendingFrame = requestAnimationFrame(() => {
			pointer = next;
			pendingFrame = null;
		});
	}

	function handlePointerLeave(): void {
		if (pendingFrame !== null) cancelAnimationFrame(pendingFrame);
		pendingFrame = null;
		pointer = null;
	}
</script>

<section
	aria-labelledby="hero-heading"
	class="relative w-full overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28"
	onpointermove={handlePointerMove}
	onpointerleave={handlePointerLeave}
>
	<HeroIconField {pointer} />
	<div class="relative mx-auto flex w-full max-w-screen-lg flex-col items-center px-6 text-center">
		<div class="relative isolate flex w-full flex-col items-center">
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -inset-x-16 -inset-y-12 -z-10 bg-[radial-gradient(ellipse_at_center,var(--background)_45%,transparent_75%)] sm:-inset-x-40 sm:-inset-y-20"
			></div>
			<span
				class="{ENTRANCE_CLASS} text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase"
			>
				{m.landing_hero_eyebrow()}
			</span>
			<h1
				class="{ENTRANCE_CLASS} mt-4 max-w-4xl font-display text-4xl font-bold tracking-tight text-balance delay-100 sm:text-6xl lg:text-7xl"
			>
				{m.landing_hero_title()}
			</h1>
			<p
				class="{ENTRANCE_CLASS} mt-6 max-w-2xl text-base text-muted-foreground text-pretty delay-200 sm:text-lg"
			>
				{m.landing_hero_description()}
			</p>
			<div
				class="{ENTRANCE_CLASS} mt-8 flex w-full flex-col items-center gap-3 delay-300 sm:w-auto"
			>
				<LandingCtaButtons />
				<p class="text-sm text-muted-foreground">
					{m.landing_hero_donation_note()}
					<Button variant="link" class="h-auto p-0" href={resolve('/support')}>
						{m.landing_hero_donation_link()}
					</Button>
				</p>
			</div>
		</div>
		{#if heroEpisode}
			<div class="{ENTRANCE_CLASS} mt-14 w-full delay-300">
				<RoomMockup episode={heroEpisode} />
			</div>
		{/if}
	</div>
</section>
