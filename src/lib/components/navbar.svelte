<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
	import UserProfileIndicator from '$lib/components/user-profile-indicator.svelte';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
</script>

{#if page.url.pathname !== "/login"}
    <div class="p-4 sticky top-0">
        <div
                class="flex flex-row items-center justify-between mx-auto w-full max-w-screen-md p-4 bg-background text-foreground border rounded-3xl"
        >
            <Logo />
            <div>
                {#if page.data.user}
                    <UserProfileIndicator />
                {:else}
                    <Button href="/login">Login</Button>
                {/if}
            </div>
        </div>
    </div>
{/if}
