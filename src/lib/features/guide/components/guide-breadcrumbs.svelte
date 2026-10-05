<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronRight } from '@lucide/svelte';
	import { JsonLd, breadcrumbSchema, type Breadcrumb } from '$lib/features/seo';

	interface GuideBreadcrumbsProps {
		breadcrumbs: Array<Breadcrumb>;
	}

	let { breadcrumbs }: GuideBreadcrumbsProps = $props();

	let schema = $derived(breadcrumbSchema(breadcrumbs));
	let lastIndex = $derived(breadcrumbs.length - 1);
</script>

<JsonLd document={schema} />

<nav aria-label="Breadcrumb">
	<ol class="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
		{#each breadcrumbs as breadcrumb, index (breadcrumb.path)}
			<li class="flex items-center gap-1">
				{#if index === lastIndex}
					<span aria-current="page" class="text-foreground">{breadcrumb.name}</span>
				{:else}
					<Button variant="link" class="h-auto p-0 text-muted-foreground" href={breadcrumb.path}>
						{breadcrumb.name}
					</Button>
					<ChevronRight class="size-3.5" aria-hidden="true" />
				{/if}
			</li>
		{/each}
	</ol>
</nav>
