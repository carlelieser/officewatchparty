<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import GoogleLogo from './google-logo.svelte';

	type Props = {
		isPending: boolean;
	};

	let { isPending }: Props = $props();
</script>

<Button type="submit" variant="outline" class="w-full" disabled={isPending}>
	<GoogleLogo />
	{isPending ? 'Redirecting...' : 'Continue with Google'}
</Button>
