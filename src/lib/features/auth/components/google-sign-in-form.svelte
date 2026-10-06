<script lang="ts">
	import { REDIRECT_PARAM } from '../redirect-target';
	import GoogleSignInButton from './google-sign-in-button.svelte';

	type Props = {
		redirectTo: string;
	};

	let { redirectTo }: Props = $props();

	let isPending = $state(false);
	// Keeps the destination in the URL if the action fails and re-renders the page.
	let action = $derived(
		`?/signInWithGoogle&${new URLSearchParams({ [REDIRECT_PARAM]: redirectTo })}`
	);

	function handleSubmit(): void {
		isPending = true;
	}

	// Going back from Google restores this page from the back/forward cache with
	// the button still disabled.
	function handlePageShow(event: PageTransitionEvent): void {
		if (event.persisted) isPending = false;
	}
</script>

<svelte:window onpageshow={handlePageShow} />

<!-- Native submit: the action redirects to Google, which client-side navigation cannot follow. -->
<form method="POST" {action} onsubmit={handleSubmit}>
	<input type="hidden" name={REDIRECT_PARAM} value={redirectTo} />
	<GoogleSignInButton {isPending} />
</form>
