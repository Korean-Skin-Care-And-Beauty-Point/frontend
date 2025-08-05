<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { pageTitle } from '$lib/store/pageTitle.svelte';
	import GoogleLogo from '$lib/assets/img/Google_Favicon_2025.svg';
	$pageTitle.title = 'Sign In';

	import Eye from 'lucide-svelte/icons/eye';
	import EyeClosed from 'lucide-svelte/icons/eye-closed';
	import { toast } from 'svelte-sonner';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { endpoints } from '$lib/utils/api.js';
	let hidePassword = $state(true);
	let isLoading = $state(false);

	let { form } = $props();

	console.log(form);

	$effect(() => {
		if (form?.status === 'success') {
			isLoading = false;
			toast.success(form?.message);
			goto('/');
		} else if (form?.status === 'error') {
			isLoading = false;
			toast.error(form?.message);
			goto('/signin');
		}
	});
</script>

<div class="mx-auto my-12 flex w-full max-w-xl flex-col gap-6 px-12 py-4">
	<h1 class="text-center text-2xl font-semibold tracking-tight">Sign in to your account</h1>
	<form
		class="flex flex-col gap-3 rounded-lg border border-gray-300 p-7"
		method="POST"
		use:enhance={({ formData }) => {
			return async ({ update }) => {
				await update({ reset: false });
			};
		}}
		onsubmit={() => (isLoading = true)}
	>
		<label for="email" class="flex flex-col gap-1">
			<p class="font-medium tracking-tight">Email</p>
			<div
				class="flex w-full items-center rounded-md border border-neutral-300 px-4 focus-within:outline focus-within:outline-offset-2 focus-within:outline-primary"
			>
				<input
					type="email"
					name="email"
					id="email"
					class="w-full rounded-md py-2 text-sm focus-visible:outline-none"
					required
				/>
			</div>
		</label>
		<div class="flex flex-col gap-2">
			<label for="password" class="flex flex-col gap-1">
				<p class="font-medium tracking-tight">Password</p>
				<div
					class="flex w-full items-center rounded-md border border-neutral-300 px-4 focus-within:outline focus-within:outline-offset-2 focus-within:outline-primary"
				>
					<input
						type={hidePassword ? 'password' : 'text'}
						name="password"
						id="password"
						class="w-full rounded-md py-2 text-sm focus-visible:outline-none"
						required
					/>

					<button
						type="button"
						onclick={() => {
							hidePassword = !hidePassword;
						}}
					>
						{#if hidePassword}
							<EyeClosed size={20} strokeWidth={1.5} />
						{:else}
							<Eye size={20} strokeWidth={1.5} />
						{/if}
					</button>
				</div>
			</label>

			<div class="flex justify-between">
				<div class="flex items-center gap-2">
					<Checkbox id="remember" />
					<label for="remember" class="text-sm">Remember me</label>
				</div>
				<a href="/signin/forgot-password" class="text-sm text-primary">Forgot Password?</a>
			</div>
		</div>

		<Button type="submit" disabled={isLoading} class={isLoading ? 'bg-primary/40' : ''}
			>{isLoading ? 'Signing in' : 'Sign in'}</Button
		>
		<div class="mt-2 flex w-full items-center gap-2">
			<hr class="w-full" />
			<p class="text-nowrap text-sm text-gray-400">Or Continue with</p>
			<hr class="w-full" />
		</div>
		<div>
			<Button
				type={'button'}
				variant={'outline'}
				class="w-full"
				onclick={(e) => {
					window.location.href = `${PUBLIC_BACKEND_URL}${endpoints.auth.googleCallback}`;
				}}
			>
				<img src={GoogleLogo} alt="Google Login" class="aspect-square w-4" />
				<p>Continue with Google</p>
			</Button>
		</div>
	</form>

	<p class="text-center">
		No Account? <a href="/register" class="text-primary">Create your Account</a>
	</p>
</div>

<style>
	:global(
		input:-webkit-autofill,
		input:-webkit-autofill:hover,
		input:-webkit-autofill:focus,
		input:-webkit-autofill:active,
		input:-internal-autofill-selected
	) {
		background-color: transparent !important;
		-webkit-box-shadow: 0 0 0 1000px white inset !important;
		-webkit-text-fill-color: #000;
	}
</style>
