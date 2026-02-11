<script lang="ts">
	import {Button} from '$lib/components/ui/button';
	import {HandCoinsIcon, ArrowUpRightIcon} from '@lucide/svelte';
	import DonateButton from '$lib/components/donate-button.svelte';
	import TvAnimation from '$lib/components/tv-animation.svelte';
</script>

<div
		class="w-full h-screen py-12 max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-8 p-4 *:flex"
>
	<div class="flex-col p-4 order-1 md:order-[unset]">
		<div class="flex flex-col gap-4 m-auto">
			<h1 class="text-6xl font-bold font-display">Superfans only.</h1>
			<p>Watch <i>The Office: Superfan Episodes</i>. Together. Even if you're from different branches...</p>
			<div class="flex flex-row items-center gap-2 mt-4">
				<DonateButton>
					{#snippet child({href})}
						<Button variant="outline" {href} target="_blank">
							<HandCoinsIcon/>
							Donate
						</Button>
					{/snippet}
				</DonateButton>
				<Button href="/login">
					Watch Now
					<ArrowUpRightIcon/>
				</Button>
			</div>
		</div>
	</div>
	<div>
		<TvAnimation/>
	</div>
</div>
