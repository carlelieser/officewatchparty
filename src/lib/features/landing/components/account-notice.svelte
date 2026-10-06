<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
</script>

<section aria-labelledby="account-heading" class="flex flex-col gap-3">
	<h2 id="account-heading" class="text-3xl font-bold font-display">Your account</h2>
	<p class="text-muted-foreground">
		Watch parties, comments, and favorites need a free account. You can sign in with a one-time code
		sent to your email, or with your Google account. We use your email address only to sign you in,
		let room owners add you to their parties, save your activity, and show your username (the part
		before the "@") on comments you post. We never sell your data or use it for advertising.
	</p>
	<p class="text-sm text-muted-foreground">
		Read our
		<Button variant="link" class="h-auto p-0" href={resolve('/privacy')}>Privacy Policy</Button>
		and
		<Button variant="link" class="h-auto p-0" href={resolve('/tos')}>Terms of Service</Button>.
	</p>
</section>
