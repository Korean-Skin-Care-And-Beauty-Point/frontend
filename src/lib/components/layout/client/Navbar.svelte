<script lang="ts">
	import Headset from 'lucide-svelte/icons/headset';
	import Mail from 'lucide-svelte/icons/mail';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Heart from 'lucide-svelte/icons/heart';
	import ShoppingBag from 'lucide-svelte/icons/shopping-bag';
	import CircleUserRound from 'lucide-svelte/icons/circle-user-round';
	import Check from 'lucide-svelte/icons/check';
	import Search from 'lucide-svelte/icons/search';
	import SlidersHorizontal from 'lucide-svelte/icons/sliders-horizontal';
	import logo from '$lib/assets/img/logo/full_logo.png?enhanced';

	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { tick } from 'svelte';
	import { cn } from '$lib/utils.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LogOut, UserRound } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	const languages = [
		{
			value: 'English',
			label: 'English',
			code: 'Us'
		},
		{
			value: 'Nepali',
			label: 'Nepali',
			code: 'Np'
		}
	];

	let { user, category } = $props();
	let open = $state(false);
	let value = $state(languages[0].value);
	let triggerRef = $state<HTMLButtonElement>(null!);
	let searchInputText = $state('');

	const selectedValue = $derived(languages.find((f) => f.value === value)?.label);
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	function searchInput(e: Event) {
		e.preventDefault();
		goto(`/category/search/${searchInputText}?q=${searchInputText}`, {
			invalidateAll: true,
			keepFocus: false,
			replaceState: true
		});
	}
</script>

<nav class="sticky top-0 z-50 bg-white">
	<!-- <div
		class="mx-auto flex w-full max-w-screen-2xl justify-between px-10 pb-2 max-md:px-6 max-sm:hidden"
	>
		<div class="flex w-full items-center justify-between">
			<div class="flex items-center gap-2">
				<a href="tel:977-98000000000" class="flex items-center gap-1 text-gray-400">
					<Headset class="h-3 w-3" />
					<p class="text-xs">+977-98000000000</p>
				</a>
				<p class="text-xs text-gray-400">|</p>
				<a href="mailto:info@koreanskincare.com" class="flex items-center gap-1 text-gray-400">
					<Mail class="h-3 w-3" />
					<p class="text-xs">info@koreanskincare.com</p>
				</a>
			</div>
			<div class="flex items-center gap-2">
				<Popover.Root bind:open>
					<Popover.Trigger bind:ref={triggerRef}>
						{#snippet child({ props }: { props: any })}
							<button
								class="flex items-center gap-1 text-xs text-gray-400 focus-visible:outline-none focus-visible:ring-0"
								{...props}
							>
								{selectedValue || 'Select a language...'}
								<ChevronDown class="w-3" />
							</button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-[200px] p-0" align="end">
						<Command.Root>
							<Command.Input placeholder="Search language..." class="text-xs" />
							<Command.List>
								<Command.Empty>No language found.</Command.Empty>
								<Command.Group>
									{#each languages as language}
										<Command.Item
											value={language.value}
											onSelect={() => {
												value = language.value;
												closeAndFocusTrigger();
											}}
											class="cursor-pointer text-sm"
										>
											<Check class={cn(value !== language.value && 'text-transparent')} />
											{language.label}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
				<p class="text-xs text-gray-400">|</p>
				<a href="/help" class="text-xs text-gray-400">Help & Support</a>
			</div>
		</div>
	</div> -->
	<div
		class="mx-auto flex max-w-screen-2xl items-center justify-between gap-10 border-y border-gray-200 px-10 py-4 max-lg:flex-wrap max-lg:gap-4 max-md:px-6 max-sm:border-y-0 max-sm:border-b max-sm:px-4 max-xs:gap-2"
	>
		<div class="w-64 max-sm:w-40 max-xs:w-32">
			<a href="/" aria-label="Logo">
				<enhanced:img src={logo} alt="Logo" class="w-64" />
			</a>
		</div>
		<div class="flex w-full items-center gap-4 max-lg:order-3 max-lg:w-full">
			<Sheet.Root>
				<Sheet.Trigger>
					<SlidersHorizontal class="md:hidden" strokeWidth={1.8} size={20} />
				</Sheet.Trigger>
				<Sheet.Content side="left" class="flex w-full flex-col gap-8 sm:w-full">
					<Sheet.Header class="text-start">
						<Sheet.Title>Categories</Sheet.Title>
					</Sheet.Header>
					<ScrollArea
						class="w-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
						scrollbarXClasses="border-none"
					>
						<div class="flex flex-col gap-4">
							{#await category then categoryItem}
								{#each categoryItem?.categories as item}
									{#if item?.status !== 'draft'}
										<a href="/category/{item?.id}/{item?.slug}" class="text-nowrap">{item?.title}</a
										>
									{/if}
								{/each}
							{/await}
						</div>
					</ScrollArea>
				</Sheet.Content>
			</Sheet.Root>

			<form class="w-full max-lg:w-full max-xs:mt-2" onsubmit={searchInput}>
				<div
					class="flex w-full items-center gap-1 rounded-lg border-[1.6px] border-gray-200 p-1 pl-4 focus-within:border-primary/40 max-sm:gap-2 max-sm:pl-3"
				>
					<Search strokeWidth={1.5} class="text-primary/45 max-sm:w-5" />
					<input
						type="text"
						placeholder="Search for products..."
						class="w-full text-sm tracking-tight focus-visible:outline-none focus-visible:ring-0 max-sm:py-2 max-xs:text-xs"
						bind:value={searchInputText}
					/>
					<button
						class="rounded-md border border-primary px-4 py-2 text-sm font-semibold tracking-tight text-primary max-sm:hidden max-xs:text-xs"
						type="submit">Search</button
					>
				</div>
			</form>
		</div>
		<div class="flex items-center gap-5 max-sm:gap-3">
			<div class="flex items-center gap-4 max-sm:gap-3 max-xs:gap-4">
				<!-- <a
					href={user?.authenticated ? '/wishlist' : '/signin'}
					class="flex flex-col items-center gap-1 max-sm:hidden max-xs:gap-0 max-xs:text-xs"
				>
					<Heart strokeWidth={1.2} class="max-xs:w-5" />
					<p class="text-nowrap text-xs font-medium">Wishlists</p>
				</a> -->
				<a
					href={user?.authenticated ? '/cart' : '/signin'}
					class="flex flex-col items-center gap-1 max-xs:gap-0"
				>
					<ShoppingBag strokeWidth={1.2} class="max-xs:w-5" />
					<p class="text-nowrap text-xs font-medium">Cart</p>
				</a>
				{#if user?.authenticated}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<div class="flex flex-col items-center">
								{#if user?.user?.profileImage}
									<img
										src={user?.user?.profileImage}
										alt="{user?.user?.name} avatar"
										class="aspect-square h-7 w-7 rounded-full object-cover object-center"
									/>
								{:else}
									<p class="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200">
										{user?.user?.name.slice(0, 1)}
									</p>
								{/if}
								<p class="text-xs font-medium">{user?.user?.name.split(' ')[0]}</p>
							</div>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" class="min-w-40">
							<DropdownMenu.Group>
								<DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading>
								<DropdownMenu.Separator class="bg-primary/15 " />
								<a href="/me/profile">
									<DropdownMenu.Item class="cursor-pointer">
										<UserRound size={20} strokeWidth={1.5} />
										<span> Profile </span>
									</DropdownMenu.Item>
								</a>
								<!-- <a href="/logout"> -->
								<DropdownMenu.Item class="flex cursor-pointer items-center text-primary">
									<form method="POST" action="/logout" use:enhance>
										<button type="submit" class="flex items-center gap-2">
											<LogOut size={20} strokeWidth={1.5} />
											<p>Logout</p>
										</button>
									</form>
									<!-- <LogOut size={20} strokeWidth={1.5} />
									<p>Logout</p> -->
								</DropdownMenu.Item>
								<!-- </a> -->
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<a href="/signin" class="flex flex-col flex-nowrap items-center gap-1 max-xs:gap-0">
						<CircleUserRound strokeWidth={1.2} class="max-xs:w-5" />
						<p class="text-nowrap text-xs font-medium">Sign In</p>
					</a>
				{/if}
			</div>
			<!-- <a
				href="/booking"
				class="text-nowrap rounded-md bg-primary px-5 py-3 text-sm font-semibold tracking-tight text-white max-md:px-3 max-md:py-3 max-md:text-xs max-xs:hidden"
				>Book Appointment</a
			> -->
		</div>
	</div>
	<div
		class="mx-auto max-w-screen-2xl border-b border-gray-200 px-10 py-2 max-sm:hidden max-xs:px-4"
	>
		<div class="flex items-center gap-2 text-sm">
			<span class="text-primary">Categories:</span>
			<span class="text-primary">|</span>
			<div class="relative overflow-hidden">
				<div
					class="w-[85dvw] overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] max-lg:w-[77dvw] max-md:w-[72dvw] max-sm:w-[64dvw] max-xs:w-[40dvw] [&::-webkit-scrollbar]:hidden"
				>
					<div class="flex gap-4">
						{#await category then categoryItem}
							{#each categoryItem?.categories as item}
								{#if item?.status !== 'draft'}
									<a href="/category/{item?.id}/{item?.slug}" class="text-nowrap">{item?.title}</a>
								{/if}
							{/each}
						{/await}
					</div>
				</div>
				<div
					class="absolute right-0 top-0 h-full w-8 bg-gradient-to-r from-transparent to-white"
				></div>
			</div>
		</div>
	</div>
</nav>
