<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowUpRightIcon, BookOpenIcon } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { LOGIN_PATH } from '$lib/features/auth/redirect-target';
	import { GUIDE_PATH } from '$lib/features/guide';
	import { cn } from '$lib/utils';
	import { m } from '$lib/paraglide/messages';

	interface LandingCtaButtonsProps {
		class?: string;
	}

	let { class: className }: LandingCtaButtonsProps = $props();
</script>

<div class={cn('flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center', className)}>
	<Button size="lg" variant="outline" href={resolve(GUIDE_PATH)}>
		<BookOpenIcon aria-hidden="true" />
		{m.landing_cta_browse_episodes()}
	</Button>
	<Button size="lg" href={resolve(LOGIN_PATH)}>
		{m.landing_cta_watch_now()}
		<ArrowUpRightIcon aria-hidden="true" />
	</Button>
</div>
