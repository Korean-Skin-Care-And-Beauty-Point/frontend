<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { ProductCard } from '$lib/components/ui/product-card';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { ListFilter } from 'lucide-svelte';
	import { pageTitle } from '$lib/store/pageTitle.svelte.js';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const { data } = $props();

	// let selectedAttributes: Record<string, string[]> = $state({});
	let selectedFilters: Record<string, Set<string>> = $state({});
	let originalFilters: { title: string; values: { value: string }[] }[] = $state([]);
	let currentFilters: { title: string; values: { value: string }[] }[] = $state([]);

	// $inspect(page.url.searchParams.get('search'));

	let initialUrlParams = $state(new URLSearchParams());

	$effect(() => {
		// Store initial URL params before any filtering
		if (Object.keys(selectedFilters).length === 0) {
			initialUrlParams = new URLSearchParams(page.url.search);
		}
	});

	$effect(() => {
		const params = new URLSearchParams(page.url.search);
		const newFilters: Record<string, Set<string>> = {};

		data?.productCategory?.then((category) => {
			if (category?.filters?.attributes) {
				category.filters.attributes.forEach((attr: { title: string }) => {
					originalFilters = category.filters.attributes;
					currentFilters = category.filters.attributes;
				});
			}
		});

		// Populate with values from URL
		params.forEach((value, key) => {
			const filterKey = key.toLowerCase();
			if (!newFilters[filterKey]) {
				newFilters[filterKey] = new Set();
			}
			newFilters[filterKey].add(value.toString());
		});

		selectedFilters = newFilters;
	});

	function handleCheckboxChange(filterType: string, value: string | number, checked: boolean) {
		const newFilters = { ...selectedFilters };

		if (!newFilters[filterType]) {
			newFilters[filterType] = new Set();
		} else {
			newFilters[filterType] = new Set(newFilters[filterType]);
		}

		if (checked) {
			newFilters[filterType].add(value.toString());
		} else {
			newFilters[filterType].delete(value.toString());
		}

		if (newFilters[filterType].size === 0) {
			delete newFilters[filterType];
			goto(`?${initialUrlParams.toString()}`, {
				keepFocus: true,
				noScroll: true,
				replaceState: true,
				invalidateAll: true
			});
			return;
		}

		selectedFilters = newFilters;
		updateUrlParams();
	}

	function updateUrlParams() {
		const params = new URLSearchParams();

		for (const [filterKey, values] of Object.entries(selectedFilters)) {
			values.forEach((value) => {
				params.append(filterKey, value);
			});
		}

		if (page.url.searchParams.get('q')) {
			params.set('q', page.url.searchParams.get('q')!);
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

	function isChecked(filterType: string, value: { value: { id: string } }): boolean {
		// const filterKey = 'attributes[]';
		return selectedFilters[filterType]?.has(value.toString()) || false;
	}
	function clearAllFilters() {
		selectedFilters = {};
		goto(`?${initialUrlParams.toString()}`, {
			keepFocus: true,
			noScroll: true,
			replaceState: true,
			invalidateAll: true
		});
	}
	$effect(() => {
		data?.productCategory
			?.then(
				(e) =>
					($pageTitle.title = page.url.searchParams.get('q')
						? e?.query
						: page.url.searchParams.get('q') === ''
							? 'All'
							: e?.filters?.categories[0].title)
			)
			.catch((e) => console.log(e));
	});
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
			<div class="flex items-center justify-between">
				<p class="text-xl font-semibold tracking-tight">Filter Options</p>
			</div>
			<div class="flex flex-col gap-6">
				{#each originalFilters as attribute}
					<div class="flex flex-col gap-2.5">
						<p class="text-sm font-semibold">{attribute.title}</p>
						<ul class="flex flex-col gap-1.5">
							{#each attribute.values as value, index}
								<li class="flex items-center gap-2">
									<Checkbox
										id={`${attribute.title}-${index}`}
										checked={isChecked('attributes[]', value.id)}
										onCheckedChange={(e) => handleCheckboxChange('attributes[]', value.id, e)}
									/>
									<!-- disabled={!currentFilters.some(
											(f) =>
												f.title === attribute.title && f.values.some((v) => v.value === value.id)
										)} -->
									<p class="text-sm">{value.value}</p>
									{#if !currentFilters.some((f) => f.title === attribute.title && f.values.some((v) => v.value === value.value))}
										<span class="text-xs text-gray-400">(0)</span>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
			<!-- <div>
				<p class="text-xl font-semibold tracking-tight">Filter Options</p>
			</div>
			<div class="flex flex-col gap-6">
				{#await data?.productCategory}
					<div></div>
				{:then category}
					{#if category?.filters?.attributes.length > 0}
						{#each category?.filters?.attributes as attribute}
							<div class="flex flex-col gap-2.5">
								<p class="text-base font-semibold">{attribute.title}</p>
								<ul class="flex flex-col gap-1.5">
									{#each attribute?.values as value, index}
										<li class="flex items-center gap-2">
											<Checkbox
												id={`${attribute.title}-${index}`}
												checked={isChecked(attribute.title, value.id)}
												onCheckedChange={(e) => {
													handleCheckboxChange(attribute.title, value.id, e);
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
			</div> -->
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
									<Sheet.Title class="text-start font-normal">{attribute.title}</Sheet.Title>
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
					{#if category?.products.length > 0}
						<p class="max-md:text-sm">
							{category?.pagination.total_items} items found for "{page.url.searchParams.get('q')
								? category?.query || page.url.searchParams.get('q')
								: page.url.searchParams.get('q') === ''
									? 'All'
									: page.params.slug.replaceAll('-', ' ')} "
						</p>
					{:else}
						<p>0 items found for "{page.url.searchParams.get('q')}"</p>
					{/if}
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
					{#if category?.products.length > 0}
						{#each category?.products as product}
							<ProductCard
								imgUrl={product.image}
								productPrice={product?.price}
								productTitle={product?.name}
								productRedirectLink={`/product/${product?.id}/${product?.slug}`}
							/>
							<!-- rating={product?.averageReview}
								discount={product?.document?.discount}
								totalReviewCount={product?.totalReviewCount} -->
						{/each}
					{:else}
						<div class="col-span-full flex h-full w-full items-center justify-center">
							<p class="text-center text-gray-400">No Items available</p>
						</div>
					{/if}
				{/await}
			</div>

			{#await data?.productCategory then category}
				<Pagination.Root
					count={category?.pagination.total_items}
					perPage={category?.pagination?.per_page}
					class="col-start-4 items-end"
				>
					{#snippet children({ pages, currentPage })}
						<Pagination.Content>
							<Pagination.Item>
								<Pagination.PrevButton />
							</Pagination.Item>
							{#each pages as page (page.key)}
								{#if page.type === 'ellipsis'}
									<Pagination.Item>
										<Pagination.Ellipsis />
									</Pagination.Item>
								{:else}
									<Pagination.Item isVisible={currentPage === page.value}>
										<Pagination.Link {page} isActive={currentPage === page.value}>
											{page.value}
										</Pagination.Link>
									</Pagination.Item>
								{/if}
							{/each}
							<Pagination.Item>
								<Pagination.NextButton />
							</Pagination.Item>
						</Pagination.Content>
					{/snippet}
				</Pagination.Root>
			{/await}
		</div>
	</div>
</div>
