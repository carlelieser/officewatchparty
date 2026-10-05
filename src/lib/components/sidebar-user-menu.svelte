<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { ChevronsUpDown } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { emailInitials } from '$lib/shared/user';

	interface SidebarUserMenuProps {
		email: string;
	}

	let { email }: SidebarUserMenuProps = $props();

	let initials = $derived(email ? emailInitials(email) : '??');
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Sidebar.MenuButton
				{...props}
				size="lg"
				tooltipContent={email}
				class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
			>
				<Avatar class="size-8 rounded-lg">
					<AvatarFallback class="rounded-lg text-xs font-bold">{initials}</AvatarFallback>
				</Avatar>
				<span class="flex-1 truncate text-left text-sm">{email}</span>
				<ChevronsUpDown class="ml-auto size-4" />
			</Sidebar.MenuButton>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="right" align="end" class="w-56">
		<DropdownMenu.Label class="truncate text-xs text-muted-foreground">
			{email}
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<a href={resolve('/auth/logout')}>
			<DropdownMenu.Item>Log out</DropdownMenu.Item>
		</a>
	</DropdownMenu.Content>
</DropdownMenu.Root>
