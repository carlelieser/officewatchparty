<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { Toaster } from 'svelte-sonner';
	import { ModeWatcher } from 'mode-watcher';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { onNavigate, beforeNavigate, afterNavigate } from '$app/navigation';
	import type { OnNavigate } from '@sveltejs/kit';
	import '../app.css';

	let { children } = $props();
	let navigating = $state(false);

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
	<title>OWP</title>
</svelte:head>

<Toaster />
<ModeWatcher />
<Tooltip.Provider>
	<div class="w-full min-h-full absolute top-0 left-0 flex flex-col">
		<Navbar />
		<div class="flex flex-1 flex-col" class:animate-pulse={navigating}>
			{@render children()}
		</div>
		<Footer />
	</div>
</Tooltip.Provider>
