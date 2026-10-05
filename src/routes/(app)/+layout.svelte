<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import { HandCoinsIcon } from '@lucide/svelte';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset class="min-w-0">
		<header
			class="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4"
			style="view-transition-name: app-header;"
		>
			<Sidebar.Trigger />
			<div class="flex items-center gap-2">
				<Button variant="secondary" size="sm" href="/support" aria-label="Support">
					<HandCoinsIcon />
					<span class="hidden sm:inline">Support</span>
				</Button>
				<ModeToggle />
			</div>
		</header>
		<main class="flex min-w-0 flex-1 flex-col">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
