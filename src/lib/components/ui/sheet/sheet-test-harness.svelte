<script lang="ts">
	import * as Sheet from './index.js';

	type SheetTestHarnessProps = {
		open: boolean;
	};

	let { open }: SheetTestHarnessProps = $props();
</script>

<Sheet.Root {open}>
	<Sheet.Content side="left">
		<Sheet.Title>Panel</Sheet.Title>
		<Sheet.Description>Panel description</Sheet.Description>
	</Sheet.Content>
</Sheet.Root>
