<script lang="ts">
	import {enhance} from '$app/forms';
	import {Button} from '$lib/components/ui/button';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import * as Popover from '$lib/components/ui/popover';
	import {MailIcon} from '@lucide/svelte';
	import {toast} from 'svelte-sonner';
	import Logo from '$lib/components/logo.svelte';

	let {form} = $props();

	let email = $state('');
	let token = $state('');
	let otpSent = $state(false);
	let loading = $state(false);
	let verifyForm!: HTMLFormElement;

	$effect(() => {
		if (token.length === 8) {
			verifyForm.requestSubmit();
		}
	});

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
					Enter your email to get started
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
						await update();
						loading = false;
					};
				}}
					class="space-y-4"
			>
				<InputGroup.Root>
					<InputGroup.Addon>
						<MailIcon />
					</InputGroup.Addon>
					<InputGroup.Input
							type="email"
							name="email"
							placeholder="you@example.com"
							bind:value={email}
							required
							autofocus
					/>
				</InputGroup.Root>
				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Sending...' : 'Send code'}
				</Button>
			</form>
			<div class="flex flex-row items-center">
				<Popover.Root>
					<Popover.Trigger openOnHover={true} class="mx-auto">
						{#snippet child({props})}
							<button
									{...props}
									class="text-xs text-muted-foreground hover:underline cursor-pointer mx-auto"
							>
								Why do I need an account?
							</button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="text-sm w-72">
						Accounts let us keep rooms safe from abuse and give you features like favorites and shareable watch parties.
					</Popover.Content>
				</Popover.Root>
			</div>
		{:else}
			<form
					bind:this={verifyForm}
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
				<input type="hidden" name="email" value={email}/>
				<div class="flex justify-center">
					<InputOTP.Root maxlength={8} bind:value={token} name="token">
						{#snippet children({cells})}
							<InputOTP.Group>
								{#each cells as cell}
									<InputOTP.Slot {cell}/>
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
