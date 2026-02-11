<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/logo.svelte';
	import DonateButton from '$lib/components/donate-button.svelte';
	import { Button } from '$lib/components/ui/button';
</script>

{#if page.url.pathname !== '/login'}
	<footer class="mx-auto w-full max-w-screen-lg p-8">
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_auto_auto] sm:gap-12">
			<div>
				<Logo />
				<p class="mt-2 text-sm text-muted-foreground">
					Watch
					<Button
						class="px-0"
						variant="link"
						href="https://www.peacocktv.com/watch/asset/tv/the-office-superfan-episodes/8229469043710582112"
					>
						The Office
					</Button>
					together.
				</p>
			</div>

			<div class="col-span-2 grid grid-cols-2 gap-8 sm:col-span-2 sm:contents">
				<div>
					<h3 class="mb-3 text-sm font-semibold text-foreground">Legal</h3>
					<ul class="flex flex-col gap-2">
						<li>
							<a href="/tos" class="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms of Service</a>
						</li>
						<li>
							<a href="/privacy" class="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</a>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="mb-3 text-sm font-semibold text-foreground">Community</h3>
					<ul class="flex flex-col gap-2">
						<li>
							<a
								href="https://github.com/carlelieser/officewatchparty"
								target="_blank"
								rel="noopener noreferrer"
								class="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>GitHub</a>
						</li>
						<li>
							<a
								href="mailto:support@officewatchparty.com"
								class="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>Support</a>
						</li>
						<li>
							<DonateButton>
								{#snippet child({ href })}
									<a
										{href}
										target="_blank"
										rel="noopener noreferrer"
										class="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>Donate</a>
								{/snippet}
							</DonateButton>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="mt-8 border-t border-border py-4">
			<p class="text-xs text-muted-foreground py-4">&copy; {new Date().getFullYear()} Office Watch Party</p>
		</div>
	</footer>
{/if}
