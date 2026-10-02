<script lang="ts">
	interface PageHeaderProps {
		title: string;
		description?: string;
	}

	let { title, description }: PageHeaderProps = $props();
</script>

<div class="flex flex-col gap-1">
	<h1 class="page-header-title text-3xl font-bold font-display lg:text-4xl">{title}</h1>
	{#if description}
		<p class="page-header-description text-sm text-muted-foreground">{description}</p>
	{/if}
</div>

<style>
	/* The title and description are shared across pages. Rather than slide with
	   the content, they do a left-to-right wipe: a clip-path boundary sweeps
	   across so the old text is concealed edge to edge while the new is revealed
	   the same way. The text does not move. The ::view-transition pseudo-elements
	   live on the document root, so they must be :global. */
	/* Global so the name also applies where the class is used outside this
	   component (e.g. the seasons layout renders its own title inline). */
	:global(.page-header-title) {
		view-transition-name: page-header-title;
	}

	:global(.page-header-description) {
		view-transition-name: page-header-description;
	}

	@keyframes -global-wipe-conceal {
		from {
			clip-path: inset(0 0 0 0);
		}
		to {
			clip-path: inset(0 0 0 100%);
		}
	}

	@keyframes -global-wipe-reveal {
		from {
			clip-path: inset(0 100% 0 0);
		}
		to {
			clip-path: inset(0 0 0 0);
		}
	}

	:global(::view-transition-old(page-header-title)),
	:global(::view-transition-old(page-header-description)) {
		animation: 260ms ease both wipe-conceal;
	}

	:global(::view-transition-new(page-header-title)),
	:global(::view-transition-new(page-header-description)) {
		animation: 260ms ease both wipe-reveal;
	}

	/* Keep old and new stacked and same-sized so the wipe boundary lines up. */
	:global(::view-transition-group(page-header-title)),
	:global(::view-transition-group(page-header-description)) {
		animation-duration: 260ms;
	}
</style>
