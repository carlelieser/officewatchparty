<script lang="ts">
	import { PartyPopperIcon } from '@lucide/svelte';
	import { resolve } from '$app/paths';
</script>

<a class="flex flex-row items-center gap-1 font-display font-bold" href={resolve('/')}>
	<PartyPopperIcon class="size-5" />
	<span>OfficeWatchParty</span>
</a>
