<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { pageTitle } from '$lib/features/seo';
	import { GUIDE_PATH } from '$lib/features/guide';

	let isNotFound = $derived(page.status === 404);
	let heading = $derived(isNotFound ? 'Page not found' : 'Something went wrong');
	let message = $derived(page.error?.message ?? heading);
</script>

<svelte:head>
	<title>{pageTitle(heading)}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="m-auto flex w-full max-w-screen-sm flex-col items-center gap-4 px-4 py-24 text-center">
	<p class="text-sm text-muted-foreground">{page.status}</p>
	<h1 class="text-4xl font-bold font-display">{heading}</h1>
	<p class="text-muted-foreground">{message}</p>
	<div class="mt-4 flex flex-row items-center gap-2">
		<Button variant="outline" href={resolve('/')}>Home</Button>
		<Button href={resolve(GUIDE_PATH)}>Episode guide</Button>
	</div>
</div>
