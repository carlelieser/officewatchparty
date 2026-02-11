<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/logo.svelte';
	import DonateButton from '$lib/components/donate-button.svelte';
	import { Button } from '$lib/components/ui/button';
</script>

{#snippet link(label: string, href: string, target?: string, rel?: string)}
	<Button variant="link" class="h-auto p-0 text-muted-foreground" {href} {target} {rel}>
		{label}
	</Button>
{/snippet}

{#if page.url.pathname !== '/login'}
	<footer class="mx-auto w-full max-w-screen-lg p-8">
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_auto_auto] sm:gap-12">
			<div>
				<Logo />
				<p class="mt-2 text-sm text-muted-foreground">
					Watch
					{@render link(
						'The Office',
						'https://www.peacocktv.com/watch/asset/tv/the-office-superfan-episodes/8229469043710582112'
					)}
					together.
				</p>
			</div>

			<div class="col-span-2 grid grid-cols-2 gap-8 sm:col-span-2 sm:contents">
				<div>
					<h3 class="mb-3 text-sm font-semibold text-foreground">Legal</h3>
					<ul class="flex flex-col gap-2">
						<li>{@render link('Terms of Service', '/tos')}</li>
						<li>{@render link('Privacy Policy', '/privacy')}</li>
					</ul>
				</div>

				<div>
					<h3 class="mb-3 text-sm font-semibold text-foreground">Community</h3>
					<ul class="flex flex-col gap-2">
						<li>
							{@render link(
								'GitHub',
								'https://github.com/carlelieser/officewatchparty',
								'_blank',
								'noopener noreferrer'
							)}
						</li>
						<li>{@render link('Support', 'mailto:support@officewatchparty.com')}</li>
						<li>
							<DonateButton>
								{#snippet child({ href })}
									{@render link('Donate', href, '_blank', 'noopener noreferrer')}
								{/snippet}
							</DonateButton>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="mt-8 border-t border-border py-4">
			<p class="text-xs text-muted-foreground py-4">
				&copy; {new Date().getFullYear()} Office Watch Party &middot; v{__APP_VERSION__}
			</p>
		</div>
	</footer>
{/if}
