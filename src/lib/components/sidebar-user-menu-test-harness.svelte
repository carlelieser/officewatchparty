<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import SidebarUserMenu from './sidebar-user-menu.svelte';

	interface SidebarUserMenuTestHarnessProps {
		email: string;
	}

	let { email }: SidebarUserMenuTestHarnessProps = $props();
</script>

<Sidebar.Provider>
	<div class="fixed inset-x-0 bottom-0">
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<SidebarUserMenu {email} />
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</div>
</Sidebar.Provider>
