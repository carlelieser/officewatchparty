<script lang="ts" module>
	import { House, Play, Clapperboard, ListVideo, Heart, Lightbulb, Tv } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import { resolve } from '$app/paths';

	type NavItem = {
		title: string;
		// The route used for the active-state check.
		match: string;
		href: string;
		icon: Component;
	};

	const navItems: Array<NavItem> = [
		{ title: 'Home', match: '/home', href: resolve('/home'), icon: House },
		{ title: 'Watch', match: '/watch', href: resolve('/watch'), icon: Play },
		{ title: 'Seasons', match: '/seasons', href: resolve('/seasons'), icon: Clapperboard },
		{ title: 'Episodes', match: '/episodes', href: resolve('/episodes'), icon: ListVideo },
		{ title: 'Favorites', match: '/favorites', href: resolve('/favorites'), icon: Heart },
		{ title: 'Trivia', match: '/trivia', href: resolve('/trivia'), icon: Lightbulb },
		{ title: 'Rooms', match: '/rooms', href: resolve('/rooms'), icon: Tv }
	];
</script>

<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import SidebarUserMenu from '$lib/components/sidebar-user-menu.svelte';
	import { PartyPopperIcon } from '@lucide/svelte';
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
	let watchHref = $derived(
		(page.data.watchHref as string | undefined) ?? `${resolve('/watch')}?season=1&episode=1`
	);

	function hrefFor(item: NavItem): string {
		// Watch resumes the user's last episode; everything else is a plain route.
		return item.match === '/watch' ? watchHref : item.href;
	}

	function isActive(match: string): boolean {
		return page.url.pathname === match || page.url.pathname.startsWith(`${match}/`);
	}
</script>

<Sidebar.Root collapsible="icon" style="view-transition-name: app-sidebar;">
	<Sidebar.Header>
		<a
			href={resolve('/')}
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
									<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- resolve() does not accept query strings; nav hrefs are resolved -->
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
					<SidebarUserMenu email={userEmail} />
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>
	{/if}
</Sidebar.Root>
