<script lang="ts">
	import { pageTitle } from '$lib/store/pageTitle.svelte';
	$pageTitle.title = 'My Profile';
	import Mail from 'lucide-svelte/icons/mail';
	import Phone from 'lucide-svelte/icons/phone';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Calendar from '$lib/components/ui/calendar/index.js';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { formData } from '$lib/store/formData.svelte.js';
	import { get } from 'svelte/store';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { Camera } from 'lucide-svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value = $state<DateValue | undefined>();
	let genderValue = $state<string | undefined>();
	let placeholder = $state<DateValue>();

	let contentRef = $state<HTMLElement | null>(null);
	let initialProfile = $state<any>(null);
	let isFormDirty = $state(false);
	let selectedGender = $state('');

	let profileImageFile = $state<File | null>(null);
	let profileImagePreview = $state<string | null>(null);

	function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			profileImageFile = input.files[0];
			profileImagePreview = URL.createObjectURL(profileImageFile);

			// Mark form as dirty
			isFormDirty = true;
		}
	}

	let { data } = $props();

	formData.set({
		name: '',
		email: '',
		phoneNumber: '',
		dob: '',
		gender: '',
		address: '',
		description: ''
	});

	$effect(() => {
		// @ts-ignore
		// $formData.dob = value?.toString();
		data?.profile
			?.then((e) => {
				console.log(e);
				initialProfile = structuredClone(e?.user);
				formData.set({
					...e?.user
				});

				if (value) {
					$formData.dob = value.toString();
					isFormDirty = checkFormChanges();
				}
				if (e?.user?.gender) {
					selectedGender = e.user.gender.toLowerCase();
					$formData.gender = e.user.gender;
				}
				if (e?.user?.dob) {
					const date = new Date(e.user.dob);
					const year = date.getFullYear();
					const month = date.getMonth() + 1;
					const day = date.getDate();

					// Create a DateValue object
					const dateValue = new CalendarDate(year, month, day);

					// Set both value and placeholder
					value = dateValue;
					placeholder = dateValue;
				}
			})
			.catch((e) => console.log(e));
	});

	function checkFormChanges() {
		if (!initialProfile) return false;
		const currentForm = get(formData);
		const currentDob = value?.toString();

		const initialDob = initialProfile.dob
			? new CalendarDate(
					new Date(initialProfile.dob).getFullYear(),
					new Date(initialProfile.dob).getMonth() + 1,
					new Date(initialProfile.dob).getDate()
				).toString()
			: '';

		const currentGender = currentForm.gender?.toLowerCase();
		const initialGender = initialProfile.gender?.toLowerCase();

		return (
			currentForm.name !== initialProfile.name ||
			currentForm.email !== initialProfile.email ||
			currentForm.phoneNumber !== initialProfile.phoneNumber ||
			currentDob !== initialDob ||
			currentGender !== initialGender ||
			currentForm.address !== initialProfile.address ||
			currentForm.description !== initialProfile.description ||
			profileImageFile !== null
		);
	}

	function selectGender(gender: string) {
		selectedGender = gender;
		$formData.gender = gender;
		isFormDirty = checkFormChanges();
	}

	const currentDate = today(getLocalTimeZone());

	const monthFmt = new DateFormatter('en-US', {
		month: 'long'
	});

	const monthOptions = Array.from({ length: 12 }, (_, i) => {
		const month = currentDate.set({ month: i + 1 });
		return {
			value: month.month,
			label: monthFmt.format(month.toDate(getLocalTimeZone()))
		};
	});

	const genders = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Others' }
	];

	const genderTrigger = $derived(
		genders.find((f) => f.value === genderValue)?.label ?? 'Select a gender'
	);

	const yearOptions = Array.from({ length: 100 }, (_, i) => ({
		label: String(new Date().getFullYear() - i),
		value: new Date().getFullYear() - i
	}));

	const defaultYear = $derived(
		placeholder ? { value: placeholder.year, label: String(placeholder.year) } : undefined
	);

	const defaultMonth = $derived(
		placeholder
			? {
					value: placeholder.month,
					label: monthFmt.format(placeholder.toDate(getLocalTimeZone()))
				}
			: undefined
	);

	const monthLabel = $derived(
		monthOptions.find((m) => m.value === defaultMonth?.value)?.label ?? 'Select a month'
	);
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-xl font-semibold">My Profile</h1>

	<div class="rounded-md border border-gray-300">
		<div>
			<form
				method="post"
				enctype="multipart/form-data"
				class="flex flex-col gap-4 px-6 py-6"
				use:enhance={({}) => {
					return async ({ result }) => {
						if (result.status) {
							toast.success('Saved!');
							isFormDirty = false;
							initialProfile = structuredClone(get(formData));
							profileImageFile = null;
							genderValue = initialProfile.gender?.toLowerCase();
							if (profileImagePreview) {
								URL.revokeObjectURL(profileImagePreview);
								profileImagePreview = null;
							}
							await invalidateAll();
						} else {
							toast.error('Failed to save.');
						}
					};
				}}
				oninput={() => (isFormDirty = checkFormChanges())}
			>
				{#await data?.profile}
					<div class="flex items-center gap-4">
						<div class="flex items-start gap-4">
							<Skeleton class="aspect-square h-full w-20 rounded-full bg-gray-100" />
							<div class="flex flex-col gap-2">
								<Skeleton class="h-12 w-48 bg-gray-100" />
								<Skeleton class="h-6 w-72 bg-gray-100" />
							</div>
						</div>
					</div>
				{:then profile}
					<!-- <label for="profileImage">ProfileImage</label> -->
					<div class="flex items-center gap-4">
						{#if profile?.user?.profileImage}
							<label
								for="profileImage"
								class="group/item relative overflow-clip rounded-full hover:cursor-pointer"
							>
								{#if profileImagePreview}
									<img
										src={profileImagePreview}
										alt="Preview"
										class="aspect-square h-full w-20 rounded-full"
									/>
								{:else if profile?.user?.profileImage}
									<img
										src={profile?.user?.profileImage}
										alt="Avatar"
										class="aspect-square h-full w-20 rounded-full"
									/>
								{/if}
								<!-- <img
									src={profile?.profile?.profileImage}
									alt="{profile?.profile?.fullName} avatar"
									class="aspect-square h-full w-20 rounded-full"
								/> -->

								<div
									class="absolute left-1/2 top-1/2 z-30 h-full w-full -translate-x-1/2 -translate-y-1/2 group-hover/item:bg-slate-800/50"
								>
									<div
										class="invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover/item:visible"
									>
										<Camera color={'#fff'} strokeWidth={1.5} />
									</div>
								</div>
							</label>
							<input
								type="file"
								name="profileImage"
								id="profileImage"
								accept="image/*"
								onchange={handleImageChange}
								class="hidden"
							/>
						{:else}
							<label
								for="profileImage"
								class="group/item relative overflow-clip rounded-full hover:cursor-pointer"
							>
								{#if profileImagePreview}
									<img
										src={profileImagePreview}
										alt="Preview"
										class="aspect-square h-full w-20 rounded-full"
									/>
								{:else if profile?.user?.name}
									<p class="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
										{profile?.user?.name.slice(0, 1)}
									</p>
								{/if}
								<div
									class="absolute left-1/2 top-1/2 z-30 h-full w-full -translate-x-1/2 -translate-y-1/2 group-hover/item:bg-slate-800/50"
								>
									<div
										class="invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover/item:visible"
									>
										<Camera color={'#fff'} strokeWidth={1.5} />
									</div>
								</div>
							</label>
							<input
								type="file"
								name="profileImage"
								id="profileImage"
								accept="image/*"
								onchange={handleImageChange}
								class="hidden"
							/>
						{/if}
						<div>
							<p class="text-2xl font-semibold">{profile?.user?.name}</p>
							<div class="flex gap-2">
								<div class="flex items-center gap-1.5">
									<Mail size={16} color="#6b7280" strokeWidth={1.5} />
									<p class="text-sm text-gray-500">{profile?.user?.email}</p>
								</div>
								<p class="text-sm text-gray-500">|</p>
								<div class="flex items-center gap-1.5">
									<Phone size={16} color="#6b7280" strokeWidth={1.5} />
									<p class="text-sm text-gray-500">(+977) {profile?.user?.phoneNumber}</p>
								</div>
							</div>
						</div>
					</div>
					{#if profile?.profile?.userType === 'CELEBRITY'}
						<div>
							<textarea
								name="description"
								id="description"
								class="w-full rounded-md border border-gray-200 bg-transparent px-4 py-2 text-sm focus-visible:outline focus-visible:outline-primary"
								placeholder="Write something about you..."
								bind:value={$formData.description}
								oninput={() => (isFormDirty = checkFormChanges())}
								>{profile?.user?.description}</textarea
							>
						</div>
					{/if}
				{/await}
				<hr />
				<div>
					<div class="flex w-full flex-col gap-4">
						<p class="text-xl font-semibold">Details</p>
						{#await data?.profile}
							<div>
								<div class="grid grid-cols-3 gap-4">
									{#each Array.from({ length: 6 })}
										<Skeleton class="h-12 w-full bg-gray-100" />
									{/each}
								</div>
							</div>
						{:then profile}
							<div class="grid w-full grid-cols-3 gap-4">
								<div class="flex w-full flex-col gap-1.5">
									<Label for="fullName">Full Name</Label>
									<div
										class="flex w-full items-center gap-1 rounded-lg border-[1.6px] border-gray-200 p-2 px-3 focus-within:border-primary max-sm:gap-2 max-sm:px-2"
									>
										<input
											type="text"
											id="fullName"
											class="w-full text-sm tracking-tight focus-visible:outline-none focus-visible:ring-0 max-sm:py-2 max-xs:text-xs"
											name="name"
											bind:value={$formData.name}
										/>
									</div>
								</div>
								<div class="flex w-full flex-col gap-1.5">
									<Label for="email">Email address</Label>
									<div
										class="flex w-full items-center gap-1 rounded-lg border-[1.6px] border-gray-200 p-2 px-3 focus-within:border-primary max-sm:gap-2 max-sm:px-2"
									>
										<input
											type="email"
											id="email"
											class="w-full text-sm tracking-tight focus-visible:outline-none focus-visible:ring-0 max-sm:py-2 max-xs:text-xs"
											name="email"
											bind:value={$formData.email}
										/>
									</div>
								</div>
								<div class="flex w-full flex-col gap-1.5">
									<Label for="phoneNumber">Phone Number</Label>
									<div
										class="flex w-full items-center gap-1 rounded-lg border-[1.6px] border-gray-200 p-2 px-3 focus-within:border-primary max-sm:gap-2 max-sm:px-2"
									>
										<input
											type="tel"
											id="phoneNumber"
											class="w-full text-sm tracking-tight focus-visible:outline-none focus-visible:ring-0 max-sm:py-2 max-xs:text-xs"
											name="phoneNumber"
											bind:value={$formData.phoneNumber}
										/>
									</div>
								</div>
								<div class="flex w-full flex-col gap-1.5">
									<Label for="phoneNumber">Date of birth</Label>
									<Popover.Root>
										<Popover.Trigger
											class={cn(
												buttonVariants({
													variant: 'outline',
													class:
														'w-full justify-start border-2 border-gray-200 text-left font-normal focus-within:border-primary'
												}),
												!value && 'text-muted-foreground'
											)}
										>
											<CalendarIcon />
											{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
											<input type="hidden" name="dob" bind:value />
										</Popover.Trigger>
										<Popover.Content bind:ref={contentRef} class="w-auto p-0">
											<!-- <Calendar type="single" bind:value bind:placeholder /> -->

											<CalendarPrimitive.Root
												type="single"
												weekdayFormat="short"
												class={cn('rounded-md border p-3')}
												bind:value
												bind:placeholder
												onValueChange={(e) => {
													value = e;
													// $formData.dob = value?.toString();
													isFormDirty = checkFormChanges();
												}}
											>
												{#snippet children({ months, weekdays })}
													<Calendar.Header class="flex w-full items-center justify-between gap-2">
														<Select.Root
															type="single"
															value={`${defaultMonth?.value}`}
															onValueChange={(v) => {
																if (!placeholder) return;
																if (v === `${placeholder.month}`) return;
																placeholder = placeholder.set({ month: Number.parseInt(v) });
																isFormDirty = checkFormChanges();
															}}
														>
															<Select.Trigger aria-label="Select month" class="w-[60%]">
																{monthLabel}
															</Select.Trigger>
															<Select.Content class="max-h-[200px] overflow-y-auto">
																{#each monthOptions as { value, label } (value)}
																	<Select.Item value={`${value}`} {label} />
																{/each}
															</Select.Content>
														</Select.Root>
														<Select.Root
															type="single"
															value={`${defaultYear?.value}`}
															onValueChange={(v) => {
																if (!v || !placeholder) return;
																if (v === `${placeholder?.year}`) return;
																placeholder = placeholder.set({ year: Number.parseInt(v) });
																isFormDirty = checkFormChanges();
															}}
														>
															<Select.Trigger aria-label="Select year" class="w-[40%]">
																{defaultYear?.label ?? 'Select year'}
															</Select.Trigger>
															<Select.Content class="max-h-[200px] overflow-y-auto">
																{#each yearOptions as { value, label } (value)}
																	<Select.Item value={`${value}`} {label} />
																{/each}
															</Select.Content>
														</Select.Root>
													</Calendar.Header>
													<Calendar.Months>
														{#each months as month (month)}
															<Calendar.Grid>
																<Calendar.GridHead>
																	<Calendar.GridRow class="flex">
																		{#each weekdays as weekday (weekday)}
																			<Calendar.HeadCell>
																				{weekday.slice(0, 2)}
																			</Calendar.HeadCell>
																		{/each}
																	</Calendar.GridRow>
																</Calendar.GridHead>
																<Calendar.GridBody>
																	{#each month.weeks as weekDates (weekDates)}
																		<Calendar.GridRow class="mt-2 w-full">
																			{#each weekDates as date (date)}
																				<Calendar.Cell
																					class="select-none"
																					{date}
																					month={month.value}
																				>
																					<Calendar.Day />
																				</Calendar.Cell>
																			{/each}
																		</Calendar.GridRow>
																	{/each}
																</Calendar.GridBody>
															</Calendar.Grid>
														{/each}
													</Calendar.Months>
												{/snippet}
											</CalendarPrimitive.Root>
										</Popover.Content>
									</Popover.Root>
								</div>

								<div class="flex w-full flex-col items-start gap-1.5">
									<Label for="phoneNumber">Gender</Label>
									<Select.Root
										type="single"
										name="gender"
										bind:value={genderValue}
										allowDeselect={false}
										onValueChange={(e) => {
											$formData.gender = e;
											genderValue = e;
											isFormDirty = checkFormChanges();
										}}
									>
										<Select.Trigger class="w-full">{genderTrigger}</Select.Trigger>
										<Select.Content>
											{#each genders as gender}
												<Select.Item value={gender.value}>{gender.label}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
									<!-- <DropdownMenu.Root>
										<DropdownMenu.Trigger
											class="w-full items-start rounded-md  border-2 border-gray-200 px-4 py-1.5 text-start capitalize focus-within:border-primary"
											>{selectedGender.toLowerCase() || 'Select a gender'}</DropdownMenu.Trigger
										>
										<DropdownMenu.Content class="w-full min-w-[23rem]" align="start">
											<DropdownMenu.Group>
												<DropdownMenu.Item onclick={() => selectGender('Male')}
													>Male</DropdownMenu.Item
												>
												<DropdownMenu.Item onclick={() => selectGender('Female')}
													>Female</DropdownMenu.Item
												>
												<DropdownMenu.Item onclick={() => selectGender('Other')}
													>Other</DropdownMenu.Item
												>
											</DropdownMenu.Group>
										</DropdownMenu.Content>
									</DropdownMenu.Root> -->
								</div>

								<div class="flex w-full flex-col items-start gap-1.5">
									<Label for="address">Address</Label>
									<div
										class="flex w-full items-center gap-1 rounded-lg border-[1.6px] border-gray-200 p-2 px-3 focus-within:border-primary max-sm:gap-2 max-sm:px-2"
									>
										<input
											type="text"
											id="address"
											class="w-full text-sm tracking-tight focus-visible:outline-none focus-visible:ring-0 max-sm:py-2 max-xs:text-xs"
											name="address"
											bind:value={$formData.address}
										/>
									</div>
								</div>
							</div>
						{/await}
						<Button
							type="submit"
							class="w-32 {isFormDirty ? 'bg-primary' : 'bg-primary/50'}"
							disabled={!isFormDirty}>Edit Details</Button
						>
					</div>
				</div>
			</form>
		</div>
	</div>
	<div class="mt-8 flex flex-col gap-2">
		<p class="text-lg font-semibold">Recent Orders</p>
		<div>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">Invoice</Table.Head>
						<Table.Head>Placed On</Table.Head>
						<Table.Head>Item</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Method</Table.Head>
						<Table.Head class="text-right">Amount</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell class="font-medium">INV001</Table.Cell>
						<Table.Cell class="font-medium">2025-03-22</Table.Cell>
						<Table.Cell class="font-medium"><a href="/">[Cell Fusion C]</a></Table.Cell>
						<Table.Cell>Paid</Table.Cell>
						<Table.Cell>Credit Card</Table.Cell>
						<Table.Cell class="text-right">$250.00</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</div>
	</div>
</div>

<style>
	:global {
		input:-webkit-autofill,
		input:-webkit-autofill:hover,
		input:-webkit-autofill:focus,
		input:-webkit-autofill:active,
		input:-internal-autofill-selected {
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
	}
</style>
