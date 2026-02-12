<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Popcorn } from '@lucide/svelte';

	interface BingeModeToggleProps {
		enabled: boolean;
		onchange: (enabled: boolean) => void;
		class?: string;
	}

	let { enabled, onchange, class: className = '' }: BingeModeToggleProps = $props();

	function handlePressedChange(pressed: boolean): void {
		onchange(pressed);
	}
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{#snippet child({ props })}
			<Toggle
				{...props}
				variant="outline"
				size="sm"
				pressed={enabled}
				onPressedChange={handlePressedChange}
				aria-label="Binge Mode"
				class="group data-[state=on]:border-yellow-500 data-[state=on]:text-yellow-500 {className}"
			>
				<Popcorn />
				<span class="text-sm whitespace-nowrap">Binge</span>
			</Toggle>
		{/snippet}
	</Tooltip.Trigger>
	<Tooltip.Content>
		Automatically play the next episode
	</Tooltip.Content>
</Tooltip.Root>
