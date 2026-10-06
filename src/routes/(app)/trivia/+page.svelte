<script lang="ts">
	import PageHeader from '$lib/components/page-header.svelte';
	import SectionHeader from '$lib/components/section-header.svelte';
	import * as Empty from '$lib/components/ui/empty';
	import { Lightbulb } from '@lucide/svelte';
	import { TriviaCard } from '$lib/features/trivia';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Daily Trivia - OWP</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-screen-md flex-col gap-8 p-4 md:p-6">
	<PageHeader title="Daily Trivia" />

	{#if data.current}
		<TriviaCard trivia={data.current} today={data.today} />
	{:else}
		<Empty.Root>
			<Empty.Content>
				<Empty.Media>
					<Lightbulb class="size-8 text-muted-foreground" />
				</Empty.Media>
				<Empty.Title>No trivia today</Empty.Title>
				<Empty.Description>Check back tomorrow for a new question.</Empty.Description>
			</Empty.Content>
		</Empty.Root>
	{/if}

	{#if data.previous.length > 0}
		<section class="flex flex-col gap-3">
			<SectionHeader title="Previous" />
			<div class="flex flex-col gap-4">
				{#each data.previous as trivia (trivia.date)}
					<TriviaCard {trivia} today={data.today} />
				{/each}
			</div>
		</section>
	{/if}
</div>
