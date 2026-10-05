<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { Toaster } from 'svelte-sonner';
	import { ModeWatcher } from 'mode-watcher';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { onNavigate, beforeNavigate, afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import type { OnNavigate } from '@sveltejs/kit';
	import { SITE_NAME } from '$lib/features/seo';
	import '../app.css';

	let { children } = $props();
	let navigating = $state(false);
	let usesSidebar = $derived(page.data.chrome === 'sidebar');

	beforeNavigate(() => {
		navigating = true;
	});

	afterNavigate(() => {
		navigating = false;
	});

	function handleViewTransition(navigation: OnNavigate): Promise<void> | undefined {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	}

	onNavigate(handleViewTransition);
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/party-popper.svg" />
	<title>{SITE_NAME}</title>
</svelte:head>

<Toaster />
<ModeWatcher />
<Tooltip.Provider>
	{#if usesSidebar}
		<div
			class="w-full min-h-full absolute top-0 left-0 flex flex-col"
			class:animate-pulse={navigating}
		>
			{@render children()}
		</div>
	{:else}
		<div class="w-full min-h-full absolute top-0 left-0 flex flex-col">
			<Navbar />
			<div class="flex flex-1 flex-col" class:animate-pulse={navigating}>
				{@render children()}
			</div>
			<Footer />
		</div>
	{/if}
</Tooltip.Provider>
