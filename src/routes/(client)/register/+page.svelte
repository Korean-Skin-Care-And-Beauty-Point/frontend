<script lang="ts">
	import { pageTitle } from '$lib/store/pageTitle.svelte';
	$pageTitle.title = 'Register';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Eye from 'lucide-svelte/icons/eye';
	import EyeClosed from 'lucide-svelte/icons/eye-closed';
	import ChevronsDown from 'lucide-svelte/icons/chevron-down';
	import { tick } from 'svelte';
	import { Check } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import provinces from '$lib/lists/provinceList';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let hidePassword = $state(true);
	let isLoading = $state(false);

	const genders = [
		{
			value: 'male',
			label: 'Male'
		},
		{
			value: 'female',
			label: 'Female'
		},
		{
			value: 'other',
			label: 'Others'
		}
	];

	let { form } = $props();
	let provinceOpen = $state(false);
	let value = $state('');
	let provinceTriggerRef = $state<HTMLButtonElement>(null!);
	let genderValue = $state('');

	const provinceValue = $derived(provinces.find((f) => f.value === value)?.value);

	const genderContent = $derived(
		genders.find((f) => f.value === genderValue)?.label ?? 'Select a gender'
	);

	function closeAndFocusProvinceTrigger() {
		provinceOpen = false;
		tick().then(() => {
			provinceTriggerRef.focus();
		});
	}

	$effect(() => {
		if (form?.status === 'success') {
			isLoading = false;
			toast.success(form?.message);
		} else if (form?.status === 'error') {
			isLoading = false;
			toast.error(form?.message);
		}
	});
</script>

<div class="mx-auto my-8 flex w-full max-w-xl flex-col gap-6 px-12 py-4">
	<h1 class="text-center text-2xl font-semibold tracking-tight">Register an account</h1>
	<form
		class="flex flex-col gap-3 rounded-lg border border-gray-300 p-7"
		method="POST"
		onsubmit={() => {
			isLoading = true;
		}}
		use:enhance={({ formData }) => {
			return async ({ update }) => {
				await update({ reset: false });
			};
		}}
	>
		<label for="fullName" class="flex flex-col gap-1">
			<p class="font-medium tracking-tight">Full Name</p>
			<div
				class="flex w-full items-center rounded-md border border-neutral-300 px-4 focus-within:outline focus-within:outline-offset-2 focus-within:outline-primary"
			>
				<input
					type="text"
					name="fullName"
					id="fullName"
					class="w-full rounded-md py-2 text-sm focus-visible:outline-none"
					required
				/>
			</div>
		</label>
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
		<label for="phoneNumber" class="flex flex-col gap-1">
			<p class="font-medium tracking-tight">Phone Number</p>
			<div
				class="flex w-full items-center rounded-md border border-neutral-300 px-4 focus-within:outline focus-within:outline-offset-2 focus-within:outline-primary"
			>
				<input
					type="number"
					name="phoneNumber"
					id="phoneNumber"
					class="w-full rounded-md py-2 text-sm focus-visible:outline-none"
					required
				/>
			</div>
		</label>
		<label for="gender" class="flex flex-col gap-1">
			<p class="font-medium tracking-tight">Gender</p>
			<div
				class="flex w-full items-center rounded-md border border-neutral-300 focus-within:outline focus-within:outline-offset-2 focus-within:outline-primary"
			>
				<Select.Root type="single" bind:value={genderValue} required name="gender">
					<Select.Trigger class="w-full">{genderContent}</Select.Trigger>
					<Select.Content>
						{#each genders as gender}
							<Select.Item value={gender.value}>{gender.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</label>
		<label for="address" class="flex flex-col gap-1">
			<p class="font-medium tracking-tight">Address</p>
			<div
				class="flex w-full items-center rounded-md border border-neutral-300 px-4 focus-within:outline focus-within:outline-offset-2 focus-within:outline-primary"
			>
				<input
					type="text"
					name="address"
					id="address"
					class="w-full rounded-md py-2 text-sm focus-visible:outline-none"
					required
				/>
			</div>
		</label>
		<div class="flex items-center gap-2">
			<label for="province" class="flex basis-[80%] flex-col gap-1">
				<p class="font-medium tracking-tight">Provinces</p>
				<div
					class="flex w-full items-center rounded-md border border-neutral-300 focus-within:outline focus-within:outline-offset-2 focus-within:outline-primary"
				>
					<Popover.Root bind:open={provinceOpen}>
						<Popover.Trigger bind:ref={provinceTriggerRef}>
							{#snippet child({ props })}
								<Button
									variant="ghost"
									class="h-9 w-full justify-between text-gray-500"
									{...props}
									role="combobox"
									aria-expanded={provinceOpen}
								>
									{provinceValue || 'Select a province...'}
									<ChevronsDown class="ml-2 size-4 shrink-0 opacity-50" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<input type="hidden" name="province" value={provinceValue} />
						<Popover.Content class="w-[26rem] min-w-full p-0" align="start">
							<Command.Root>
								<Command.Input placeholder="Search province..." />
								<Command.List>
									<Command.Empty>No province found.</Command.Empty>
									<Command.Group>
										{#each provinces as province, index}
											<Command.Item
												value={province.value}
												onSelect={() => {
													value = province.value;
													closeAndFocusProvinceTrigger();
												}}
											>
												<Check
													class={cn('mr-2 size-4', value !== province.value && 'text-transparent')}
												/>
												{province.value}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>
			</label>
			<label for="zipCode" class="flex flex-col gap-1">
				<p class="font-medium tracking-tight">Zip Code</p>
				<div
					class="flex w-full items-center rounded-md border border-neutral-300 px-4 focus-within:outline focus-within:outline-offset-2 focus-within:outline-primary"
				>
					<input
						type="text"
						name="zipCode"
						id="zipCode"
						class="w-full rounded-md py-2 text-sm focus-visible:outline-none"
						required
					/>
				</div>
			</label>
		</div>
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
		</div>

		<Button type="submit" disabled={isLoading} class={isLoading ? 'bg-primary/40' : ''}
			>{isLoading ? 'Registering Now' : 'Register Now'}</Button
		>
		<div class="mt-2 flex w-full items-center gap-2">
			<hr class="w-full" />
			<p class="text-nowrap text-sm text-gray-400">Or Continue with</p>
			<hr class="w-full" />
		</div>
	</form>

	<p class="text-center">
		Already have account? <a href="/signin" class="text-primary"> Sign In</a>
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

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button,
	input[type='number'] {
		-webkit-appearance: none;
		margin: 0;
		-moz-appearance: textfield !important;
	}
</style>
