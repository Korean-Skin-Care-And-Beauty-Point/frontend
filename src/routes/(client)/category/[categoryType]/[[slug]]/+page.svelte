<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { ProductCard } from '$lib/components/ui/product-card';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import malika from '$lib/assets/img/actress/malika.png';
	import { ListFilter } from 'lucide-svelte';
	import { pageTitle } from '$lib/store/pageTitle.svelte.js';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	// type AttributeValue = {
	// 	value: string;
	// 	count: number;
	// 	checked: boolean;
	// };

	// type Attribute = {
	// 	title: string;
	// 	values: AttributeValue[];
	// };

	const { data } = $props();
	// let selectedAttributes: Record<string, string[]> = $state({});
	let selectedFilters: Record<string, Set<string>> = $state({});

	$inspect(page.url.searchParams.get('search'));

	$effect(() => {
		const params = new URLSearchParams(page.url.search);
		const newFilters: Record<string, Set<string>> = {};

		// Initialize filters based on API response if available
		data?.productCategory?.then((category) => {
			if (category?.attributes) {
				category.attributes.forEach((attr: { title: string }) => {
					const filterKey = attr.title.toLowerCase();
					if (!newFilters[filterKey]) {
						newFilters[filterKey] = new Set();
					}
				});
			}
		});

		// Populate with values from URL
		params.forEach((value, key) => {
			const filterKey = key.toLowerCase();
			if (!newFilters[filterKey]) {
				newFilters[filterKey] = new Set();
			}
			newFilters[filterKey].add(value);
		});

		selectedFilters = newFilters;
	});

	function handleCheckboxChange(filterType: string, value: string, checked: boolean) {
		// Create a new Set to trigger reactivity
		const newFilters = { ...selectedFilters };
		const filterKey = filterType.toLowerCase();

		// Initialize the filter if it doesn't exist
		if (!newFilters[filterKey]) {
			newFilters[filterKey] = new Set();
		} else {
			newFilters[filterKey] = new Set(newFilters[filterKey]);
		}

		if (checked) {
			newFilters[filterKey].add(value);
		} else {
			newFilters[filterKey].delete(value);
		}

		selectedFilters = newFilters;
		updateUrlParams();
	}

	function updateUrlParams() {
		const params = new URLSearchParams();

		// Add all active filters to URL
		for (const [filterKey, values] of Object.entries(selectedFilters)) {
			values.forEach((value) => {
				params.append(filterKey, value);
			});
		}

		// Preserve search and category params
		if (page.url.searchParams.get('search')) {
			params.set('search', page.url.searchParams.get('search')!);
		}
		if (page.url.searchParams.get('categories')) {
			params.set('categories', page.url.searchParams.get('categories')!);
		}

		goto(`?${params.toString()}`, {
			keepFocus: true,
			noScroll: true,
			replaceState: true,
			invalidateAll: true
		});
	}

	function isChecked(filterType: string, value: string): boolean {
		const filterKey = filterType.toLowerCase();
		return selectedFilters[filterKey]?.has(value) || false;
	}

	$effect(() => {
		data?.productCategory
			?.then(
				(e) => (
					($pageTitle.title = page.url.searchParams.get('search')
						? e?.product?.request_params.q
						: page.url.searchParams.get('search') === ''
							? 'All'
							: e?.product?.hits[0]?.document?.ProductCategory[0]?.category?.title),
					console.log(e)
				)
			)
			.catch((e) => console.log(e));
	});

	// function handleCheckboxChange(filterType: string, title: string, checked: boolean) {
	// 	if (checked) {
	// 		selectedFilters[filterType].push(title);
	// 	} else {
	// 		selectedFilters[filterType] = selectedFilters[filterType].filter(
	// 			(item: string) => item !== title
	// 		);
	// 	}
	// 	updateUrlParams();
	// }

	// function updateUrlParams() {
	// 	const params = new URLSearchParams();
	// 	for (const filterType in selectedFilters) {
	// 		if (selectedFilters[filterType].length > 0) {
	// 			selectedFilters[filterType].forEach((value: string) => {
	// 				params.append(filterType.toLowerCase(), value);
	// 			});
	// 		}
	// 	}
	// 	goto(`?${params.toString()}`, {
	// 		keepFocus: true,
	// 		noScroll: true,
	// 		replaceState: true,
	// 		invalidateAll: true
	// 	});
	// }
</script>

<div class="mx-auto mb-16 flex w-full max-w-screen-2xl flex-col gap-8 px-12 max-md:px-4">
	<div class="mt-4 text-3xl font-semibold tracking-tight max-md:hidden">
		{#await data?.productCategory}
			<Skeleton class="h-6 w-48 bg-gray-200" />
		{:then category}
			<h1>{category?.category?.title}</h1>
		{/await}
	</div>

	<div class="grid grid-cols-10 gap-8 max-md:gap-6">
		<div
			class="col-span-2 flex h-auto w-full flex-col gap-4 rounded-lg border border-gray-200 px-4 py-4 max-lg:hidden"
		>
			<div>
				<p class="text-xl font-semibold tracking-tight">Filter Options</p>
			</div>
			<div class="flex flex-col gap-6">
				{#await data?.productCategory}
					<div></div>
				{:then category}
					{#if category?.attributes.length > 0}
						{#each category?.attributes as attribute}
							<div class="flex flex-col gap-2.5">
								<p class="text-base font-semibold">{attribute.title}</p>
								<ul class="flex flex-col gap-1.5">
									{#each attribute?.values as value, index}
										<li class="flex items-center gap-2">
											<Checkbox
												id={`${attribute.title}-${index}`}
												checked={isChecked(attribute.title, value.value)}
												onCheckedChange={(e) => {
													handleCheckboxChange(attribute.title, value.value, e);
												}}
											/>
											<p class="text-sm">{value.value}</p>
										</li>
									{/each}
								</ul>
							</div>
						{/each}
					{/if}
				{/await}
			</div>
		</div>

		<div class="col-span-full w-full lg:hidden">
			<Sheet.Root>
				<Sheet.Trigger
					class="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 py-2 max-lg:w-48 max-md:w-full"
					><ListFilter size={18} /> Filter</Sheet.Trigger
				>
				<Sheet.Content side="left" class="!w-full">
					<Sheet.Header>
						{#await data?.productCategory}
							<div></div>
						{:then category}
							{#if category?.attributes.length > 0}
								{#each category?.attributes as attribute}
									<Sheet.Title class="text-start">{attribute.title}</Sheet.Title>
									<Sheet.Description>
										<ul class="flex flex-col gap-1.5">
											{#each attribute?.values as value}
												<li class="flex items-center gap-2">
													<Checkbox />
													<p class="text-sm">{value.value}</p>
												</li>
											{/each}
										</ul>
									</Sheet.Description>
								{/each}
							{/if}
						{/await}
					</Sheet.Header>
				</Sheet.Content>
			</Sheet.Root>
		</div>

		<div class="col-span-8 flex flex-col gap-6 max-lg:col-span-full max-md:gap-4">
			<div>
				{#await data?.productCategory}
					<Skeleton class="h-4 w-64 bg-gray-200" />
				{:then category}
					<p class="max-md:text-sm">
						{category?.product?.found} items found for "{page.url.searchParams.get('search')
							? category?.product?.request_params.q
							: page.url.searchParams.get('search') === ''
								? 'All'
								: category?.product?.hits[0]?.document?.ProductCategory[0]?.category?.title}"
					</p>
				{/await}
			</div>
			<div
				class="grid grid-cols-4 gap-4 max-2lg:grid-cols-3 max-lg:grid-cols-3 max-md:grid-cols-2 max-md:gap-2"
			>
				{#await data?.productCategory}
					{#each Array.from({ length: 15 })}
						<Skeleton class="aspect-[4/5] h-full w-full bg-gray-200" />
					{/each}
				{:then category}
					{#if category?.product?.hits.length > 0}
						{#each category?.product.hits as product}
							<ProductCard
								imgUrl={`${category.baseUrl}/${product.document.image}`}
								productPrice={product?.document?.price}
								productTitle={product?.document?.name}
								rating={product?.averageReview}
								discount={product?.document?.discount}
								productRedirectLink={`/product/${product?.document?.id}/${product?.document?.slug}`}
								totalReviewCount={product?.totalReviewCount}
							/>
						{/each}
					{:else}
						<div class="col-span-full flex h-full w-full items-center justify-center">
							<p class="text-center text-gray-400">No Items available</p>
						</div>
					{/if}
				{/await}
			</div>
		</div>
	</div>
</div>
