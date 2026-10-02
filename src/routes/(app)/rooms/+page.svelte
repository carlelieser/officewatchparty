<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import Rooms from '$lib/features/rooms/components/rooms.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Rooms - OWP</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-screen-lg flex-col gap-6 p-4 md:p-6">
	<PageHeader title="Rooms" description="Watch parties you host." />
	<Rooms initial={data.rooms} showHeading={false} />
</div>
