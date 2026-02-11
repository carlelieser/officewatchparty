<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import { Toaster } from 'svelte-sonner';
	import { ModeWatcher } from "mode-watcher";
	import { onNavigate, beforeNavigate, afterNavigate } from '$app/navigation';
	import '../app.css';

	let { children } = $props();
	let navigating = $state(false);

	beforeNavigate(() => {
		navigating = true;
	});

	afterNavigate(() => {
		navigating = false;
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/party-popper.svg" />
	<title>OWP</title>
</svelte:head>

<Toaster />
<ModeWatcher />

<div class="size-full absolute top-0 left-0 flex flex-col">
	<Navbar />
	<div class="flex flex-1 flex-col" class:animate-pulse={navigating}>
		{@render children()}
	</div>
</div>
