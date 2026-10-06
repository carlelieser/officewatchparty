<script lang="ts">
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { MOCK_VIEWERS, MOCK_VIEWER_OVERFLOW_COUNT } from '../room-mockup-data';
	import { m } from '$lib/paraglide/messages';
</script>

<div class="flex items-center gap-2">
	<div class="flex -space-x-1">
		{#each MOCK_VIEWERS as viewer (viewer.name)}
			<Avatar class="size-6 border bg-background ring-2 ring-card sm:size-7">
				<AvatarFallback class="bg-background text-[10px] font-medium">
					{viewer.initials}
				</AvatarFallback>
			</Avatar>
		{/each}
	</div>
	<span class="hidden text-xs text-muted-foreground sm:inline">
		{m.landing_mockup_watching({ count: MOCK_VIEWER_OVERFLOW_COUNT })}
	</span>
</div>
