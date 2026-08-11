<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { MONTHLY_COST_LABEL } from '$lib/shared/donation-costs';

	interface DonationToastContentProps {
		onSupport: () => void;
		onDismiss: () => void;
		onAlreadyDonated: () => void;
	}

	let { onSupport, onDismiss, onAlreadyDonated }: DonationToastContentProps = $props();
</script>

<div class="flex flex-col gap-3">
	<div class="flex flex-col gap-1">
		<p class="text-sm font-semibold text-foreground">Enjoying the party?</p>
		<p class="text-sm text-muted-foreground">
			Keeping this running costs about {MONTHLY_COST_LABEL} a month. Chip in if you want.
		</p>
	</div>

	<div class="flex flex-row items-center gap-2">
		<Button size="sm" onclick={onSupport}>Support</Button>
		<Button variant="ghost" size="sm" onclick={onDismiss}>Not now</Button>
	</div>

	<Button
		variant="link"
		size="sm"
		class="h-auto justify-start p-0 text-xs text-muted-foreground"
		onclick={onAlreadyDonated}
	>
		I already chipped in
	</Button>
</div>
