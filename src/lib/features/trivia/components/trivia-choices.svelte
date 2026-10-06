<script lang="ts">
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';

	type TriviaChoicesProps = {
		choices: Array<string>;
		value: string;
		isDisabled: boolean;
		labelledBy: string;
	};

	let { choices, value = $bindable(), isDisabled, labelledBy }: TriviaChoicesProps = $props();

	const id = $props.id();
</script>

<RadioGroup.Root bind:value disabled={isDisabled} aria-labelledby={labelledBy} class="gap-2">
	{#each choices as choice, index (index)}
		{@const choiceId = `${id}-choice-${index}`}
		<Label
			for={choiceId}
			class="cursor-pointer rounded-lg border px-3 py-2 font-normal leading-snug has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent"
		>
			<RadioGroup.Item id={choiceId} value={String(index)} />
			{choice}
		</Label>
	{/each}
</RadioGroup.Root>
