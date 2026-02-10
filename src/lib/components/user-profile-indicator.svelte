<script lang="ts">
	import { page } from '$app/state';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	const user = $derived(page.data.user);
	const initials = $derived(
		user?.email ? user.email.split('@')[0].slice(0, 2).toUpperCase() : '??'
	);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar class="size-8 cursor-pointer">
			<AvatarFallback class="font-bold text-xs">{initials}</AvatarFallback>
		</Avatar>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-48">
		<DropdownMenu.Label class="truncate text-xs text-muted-foreground">
			{user?.email}
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<a href="/auth/logout">
			<DropdownMenu.Item>Log out</DropdownMenu.Item>
		</a>
	</DropdownMenu.Content>
</DropdownMenu.Root>
