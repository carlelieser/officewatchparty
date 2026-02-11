<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
	import UserProfileIndicator from '$lib/components/user-profile-indicator.svelte';
	import {page} from '$app/state';
	import {Button} from '$lib/components/ui/button';
	import DonateButton from '$lib/components/donate-button.svelte';
	import ModeToggle from "$lib/components/mode-toggle.svelte"
</script>

{#if page.url.pathname !== "/login"}
    <div class="p-4 sticky top-0 z-20" style="view-transition-name: navbar;">
        <div
                class="flex flex-row items-center justify-between mx-auto w-full max-w-screen-md p-4 bg-background text-foreground border rounded-3xl"
        >
            <Logo/>
            <div class="flex flex-row items-center gap-2">
                <DonateButton />
                <ModeToggle/>
                {#if page.data.user}
                    <UserProfileIndicator/>
                {:else}
                    <Button href="/login">Login</Button>
                {/if}
            </div>
        </div>
    </div>
{/if}
