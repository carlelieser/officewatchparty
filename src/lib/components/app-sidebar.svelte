<script lang="ts" module>
	import { House, Play, Clapperboard, ListVideo, Heart, Tv } from '@lucide/svelte';
	import type { Component } from 'svelte';

	type NavItem = {
		title: string;
		// The route used for the active-state check.
		match: string;
		icon: Component;
	};

	const navItems: Array<NavItem> = [
		{ title: 'Home', match: '/home', icon: House },
		{ title: 'Watch', match: '/watch', icon: Play },
		{ title: 'Seasons', match: '/seasons', icon: Clapperboard },
		{ title: 'Episodes', match: '/episodes', icon: ListVideo },
		{ title: 'Favorites', match: '/favorites', icon: Heart },
		{ title: 'Rooms', match: '/rooms', icon: Tv }
	];
</script>

<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { PartyPopperIcon, ChevronsUpDown } from '@lucide/svelte';
	import { emailInitials } from '$lib/shared/user';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';

	const sidebar = useSidebar();

	// On mobile the sidebar is a sheet overlay; close it after navigating so it
	// doesn't stay open covering the new page.
	afterNavigate(() => {
		if (sidebar.isMobile) sidebar.setOpenMobile(false);
	});

	let userEmail = $derived(page.data.user?.email ?? '');
	let initials = $derived(userEmail ? emailInitials(userEmail) : '??');
	let watchHref = $derived(
		(page.data.watchHref as string | undefined) ?? '/watch?season=1&episode=1'
	);

	function hrefFor(item: NavItem): string {
		// Watch resumes the user's last episode; everything else is a plain route.
		return item.match === '/watch' ? watchHref : item.match;
	}

	function isActive(match: string): boolean {
		return page.url.pathname === match || page.url.pathname.startsWith(`${match}/`);
	}
</script>

<Sidebar.Root collapsible="icon" style="view-transition-name: app-sidebar;">
	<Sidebar.Header>
		<a
			href="/"
			class="flex items-center gap-2 p-2 font-display font-bold group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
		>
			<PartyPopperIcon class="size-5 shrink-0" />
			<span class="group-data-[collapsible=icon]:hidden">OfficeWatchParty</span>
		</a>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each navItems as item (item.match)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={isActive(item.match)} tooltipContent={item.title}>
								{#snippet child({ props })}
									<a href={hrefFor(item)} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	{#if page.data.user}
		<Sidebar.Footer>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton
									{...props}
									size="lg"
									tooltipContent={userEmail}
									class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar class="size-8 rounded-lg">
										<AvatarFallback class="rounded-lg text-xs font-bold">{initials}</AvatarFallback>
									</Avatar>
									<span class="flex-1 truncate text-left text-sm">{userEmail}</span>
									<ChevronsUpDown class="ml-auto size-4" />
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content side="right" align="end" class="w-56">
							<DropdownMenu.Label class="truncate text-xs text-muted-foreground">
								{userEmail}
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<a href="/auth/logout">
								<DropdownMenu.Item>Log out</DropdownMenu.Item>
							</a>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>
	{/if}
</Sidebar.Root>
