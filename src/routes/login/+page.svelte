<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import { toast } from 'svelte-sonner';
	import Logo from "$lib/components/logo.svelte"

	let { form } = $props();

	let email = $state('');
	let token = $state('');
	let otpSent = $state(false);
	let loading = $state(false);

	$effect(() => {
		if (form?.error) {
			toast.error(form.error);
		}
		if (form?.otpSent) {
			otpSent = true;
			email = form.email;
		} else if (form?.email) {
			email = form.email;
		}
	});
</script>

<div class="flex flex-col flex-1">
	<div class="w-full max-w-sm space-y-6 m-auto">
		<div class="space-y-2 flex flex-col text-center">
            <div class="m-auto mb-12">
                <Logo/>
            </div>
			<h1 class="text-2xl font-bold">Welcome</h1>
			<p class="text-sm text-muted-foreground">
				{#if otpSent}
					Enter the code sent to {email}
				{:else}
					Sign in with your email
				{/if}
			</p>
		</div>

		{#if !otpSent}
			<form
				method="POST"
				action="?/sendOtp"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
				class="space-y-4"
			>
				<Input
					type="email"
					name="email"
					placeholder="you@example.com"
					bind:value={email}
					required
					autofocus
				/>
				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Sending...' : 'Send code'}
				</Button>
			</form>
		{:else}
			<form
				method="POST"
				action="?/verifyOtp"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="email" value={email} />
				<div class="flex justify-center">
					<InputOTP.Root maxlength={8} bind:value={token} name="token">
						{#snippet children({ cells })}
							<InputOTP.Group>
								{#each cells as cell}
									<InputOTP.Slot {cell} />
								{/each}
							</InputOTP.Group>
						{/snippet}
					</InputOTP.Root>
				</div>
				<Button type="submit" class="w-full" disabled={loading || token.length < 8}>
					{loading ? 'Verifying...' : 'Verify'}
				</Button>
				<Button
					variant="ghost"
					class="w-full"
					type="button"
					onclick={() => {
						otpSent = false;
						token = '';
					}}
				>
					Use a different email
				</Button>
			</form>
		{/if}
	</div>
</div>
