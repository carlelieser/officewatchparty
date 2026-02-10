<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/party-popper.svg" />
	<title>OWP</title>
</svelte:head>

<Toaster />

<div class="size-full absolute top-0 left-0 flex flex-col">
	<Navbar />
	<div class="flex flex-1 flex-col">
		{@render children()}
	</div>
</div>
