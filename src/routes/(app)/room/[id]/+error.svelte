<script lang="ts">
	import { page } from '$app/state';
	import * as Empty from '$lib/components/ui/empty';
	import { TriangleAlert } from '@lucide/svelte';
</script>

<div class="flex size-full items-center justify-center">
	<Empty.Root>
		<Empty.Media>
			<TriangleAlert />
		</Empty.Media>
		<Empty.Title>{page.error?.message ?? 'Something went wrong'}</Empty.Title>
	</Empty.Root>
</div>
