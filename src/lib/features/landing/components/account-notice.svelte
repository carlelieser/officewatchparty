<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { m } from '$lib/paraglide/messages';
</script>

<section aria-labelledby="account-heading" class="w-full py-20 sm:py-28">
	<div class="mx-auto flex w-full max-w-screen-md flex-col gap-3 px-6">
		<h2 id="account-heading" class="font-display text-2xl font-bold tracking-tight sm:text-3xl">
			{m.landing_account_heading()}
		</h2>
		<p class="text-muted-foreground">
			{m.landing_account_description()}
		</p>
		<p class="text-sm text-muted-foreground">
			{m.landing_account_links_prefix()}
			<Button variant="link" class="h-auto p-0" href={resolve('/privacy')}
				>{m.landing_account_privacy_policy()}</Button
			>
			{m.landing_account_links_conjunction()}
			<Button variant="link" class="h-auto p-0" href={resolve('/tos')}
				>{m.landing_account_terms_of_service()}</Button
			>.
		</p>
	</div>
</section>
