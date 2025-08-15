<script lang="ts">
	import { pageTitle } from '$lib/store/pageTitle.svelte';
	import { swiper } from '$lib/actions/swiper.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import SvelteRating from '$lib/components/ui/rating';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { CircleCheckBig, ClipboardPlus, Earth, FlaskConical } from 'lucide-svelte';
	import { ProductCard } from '$lib/components/ui/product-card/index.js';
	import malika from '$lib/assets/img/actress/malika.png';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import DOMPurify from 'isomorphic-dompurify';

	let { data, form } = $props();
	let thumbsSwiper = $state();
	let isLoading = $state(false);

	const price = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'NPR'
	});
	let discountPrice = $state(0);
	let discount = $state(false);
	let selectedAttributes = $state({});

	function updateSelectedAttribute(title: any, value: any) {
		console.log(value);
		selectedAttributes = { ...selectedAttributes, [title]: value };
	}

	$effect(() => {
		data?.product
			?.then((e) => {
				$pageTitle.title = e?.product?.name;
				// discountPrice =
				// 	e?.product?.price - (e?.product?.discount?.discountValue / 100) * e?.product?.price;

				discount = e?.product?.discount?.discount_amount > 0 ? true : false;
				console.log(e);
			})
			.catch((err) => {
				console.log(err);
			});

		if (form?.CartStatus === 'success') {
			isLoading = false;
			// toast.success(form?.CartMessage);
			goto('/cart', {
				invalidateAll: true
			});
		} else if (form?.CartStatus === 'error') {
			isLoading = false;
			// toast.error(form?.CartMessage);
		}

		if (form?.status === 'success') {
			isLoading = false;
			// toast.success(form?.message);
			goto('/me/order/wishlist', {
				invalidateAll: true,
				keepFocus: true,
				noScroll: true
			});
		} else if (form?.status === 'error') {
			isLoading = false;
			// toast.error(form?.message);
		}
	});

	function formatRelativeTime(isoDate: string | number | Date) {
		const now = new Date();
		const date = new Date(isoDate);
		const diffInDays = Math.round((date - now) / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) return 'today';
		if (diffInDays === 1) return 'tomorrow';
		if (diffInDays === -1) return 'yesterday';
		if (diffInDays > 0) return `in ${diffInDays} days`;
		return `${Math.abs(diffInDays)} days ago`;
	}
</script>

<div class="mx-auto flex w-full max-w-screen-2xl flex-col gap-12 px-12 pt-4 max-md:px-2">
	<div class="grid grid-cols-2 items-start max-md:grid-cols-1">
		<div class="grid grid-cols-6 gap-4 max-md:grid-cols-1">
			<!-- Main Swiper Gallery -->
			<div
				class="swiper col-span-4 col-start-2 !mx-auto max-w-[1450px] overflow-clip max-xl:px-4 max-md:col-span-1"
				use:swiper={{
					slidesPerView: 1,
					spaceBetween: 20,
					// autoplay: {
					// 	delay: 4500,
					// 	disableOnInteraction: false
					// },
					thumbs: {
						swiper: thumbsSwiper
					}
				}}
			>
				<div class="swiper-wrapper w-full">
					{#await data?.product}
						<Skeleton class="aspect-[4/4] !h-full !w-full rounded-xl bg-gray-200" />
					{:then productImage}
						{#if productImage?.product?.gallery?.length > 0}
							{#each productImage?.product?.gallery as image}
								<div class="swiper-slide !w-full">
									<img
										src={`${image?.img_file}`}
										alt="Slider"
										class="aspect-[4/4] h-full !w-full rounded-xl object-contain object-center max-sm:aspect-video"
									/>
								</div>
							{/each}
						{:else}
							<Skeleton class="aspect-square !h-full !w-full rounded-xl bg-gray-200" />
						{/if}
					{/await}
				</div>
			</div>

			<!-- Thumbnail Swiper Gallery -->
			<div
				class="swiper thumbSwiper col-start-1 row-start-1 w-full overflow-clip max-xl:px-4 max-md:col-span-1 max-md:row-start-2"
				use:swiper={{
					slidesPerView: 4,
					freeMode: true,
					watchSlidesProgress: true,
					// autoplay: {
					// 	delay: 4500,
					// 	disableOnInteraction: false
					// },
					on: {
						init(swiper: unknown) {
							thumbsSwiper = swiper;
						}
					}
				}}
			>
				<div class="swiper-wrapper w-full flex-col gap-2 max-md:flex-row">
					{#await data?.product}
						{#each Array.from({ length: 4 })}
							<Skeleton class="aspect-[4/4] h-full w-full rounded-xl bg-gray-200" />
						{/each}
					{:then productImage}
						{#if productImage?.product?.gallery?.length > 0}
							{#each productImage?.product?.gallery as image}
								<div class="swiper-slide !h-auto !w-full cursor-pointer">
									<img
										src={`${image?.img_file}`}
										alt="Slider"
										class="aspect-[4/4] h-auto w-full rounded-xl object-contain object-center max-sm:aspect-video"
									/>
								</div>
							{/each}
						{:else}
							{#each Array.from({ length: 4 })}
								<Skeleton class="aspect-[4/4] h-full w-full rounded-xl bg-gray-200" />
							{/each}
						{/if}
					{/await}
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-4">
			{#await data?.product}
				<Skeleton class="aspect-[4/4] h-16 w-full rounded-xl bg-gray-200" />
			{:then product}
				<div>
					<!-- {#if product?.product?.pickedByCelebrities.length > 0}
						<div class="mb-4 flex w-full items-center gap-2">
							<p class="text-nowrap">Picked by:</p>
							{#each product?.product?.pickedByCelebrities as celebrity}
								<div class="flex w-full items-center gap-0">
									{#if celebrity?.profileImage}
										<img
											src={celebrity?.profileImage}
											alt="{celebrity?.fullName} avatar"
											class="-mr-4 aspect-square h-7 w-7 rounded-full object-cover object-center"
										/>
									{:else}
										<p
											class="-mr-4 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-sm"
										>
											{celebrity?.fullName.slice(0, 1)}
										</p>
									{/if}
								</div>
							{/each}
						</div>
					{/if} -->
					<div class="flex flex-col gap-1">
						<p class="line-clamp-2 text-2xl font-semibold tracking-tight">
							{product?.product?.name}
						</p>
						<div class="flex items-start gap-2">
							<SvelteRating rating={product?.product?.averageRating || 0} config={{ size: 16 }} />
							<p class="text-sm text-gray-400">
								{product?.product?.totalReviewCount}
								{#if product?.product?.totalReviewCount > 0}
									{product?.product?.totalReviewCount > 1 ? 'Reviews' : 'Review'}
								{:else}
									No Review
								{/if}
							</p>
						</div>
					</div>

					<div class="mt-4 flex items-center gap-3 max-md:flex-col max-md:items-start">
						<p class="text-2xl font-semibold tracking-tight text-primary max-md:text-xl">
							{price.format(product?.product?.final_price).replace('NPR', 'Rs.')}
						</p>
						{#if discount}
							<div class="flex items-center gap-2">
								<p
									class="text-xl font-medium tracking-tight text-red-200 line-through max-md:text-lg"
								>
									{price.format(product?.product?.discount?.original_price).replace('NPR', 'Rs.')}
								</p>
								<p
									class="rounded-md bg-primary px-2 py-0.5 text-sm font-semibold text-white max-md:text-xs"
								>
									{product?.product?.discount?.discount_amount}% OFF
								</p>
							</div>
						{/if}
					</div>
					<p class="mt-3 line-clamp-3 font-medium leading-snug">
						{product?.product?.shortDescription}
					</p>

					<div class="mt-4 flex justify-between gap-8 max-md:flex-col">
						{#await data?.product}
							<div class="flex gap-2">
								<Skeleton class="h-8 w-full bg-gray-100" />
								<Skeleton class="h-8 w-full bg-gray-100" />
							</div>
						{:then products}
							{#if products?.product.attributes || products?.product.attributes.length > 0}
								{#each products?.product.attributes as attribute}
									<div class="flex w-full flex-col gap-1">
										<p class="text-xl font-semibold text-black max-sm:text-base">
											{attribute.attribute}:
										</p>

										<div class="flex w-full gap-2">
											{#each attribute.values as value}
												<label for={value?.value} class="group flex w-full cursor-pointer">
													<input
														type="radio"
														name={attribute.attribute}
														id={value?.value}
														{value}
														class="peer invisible absolute"
														onchange={() =>
															updateSelectedAttribute(
																attribute.attribute_id,
																value?.attribute_value_id
															)}
													/>
													<div
														class="w-full rounded-md border border-zinc-300 px-1.5 py-2 text-center text-sm font-semibold peer-checked:border-0
															peer-checked:bg-primary/5
															peer-checked:outline
															peer-checked:outline-primary
															"
													>
														{value?.value}
													</div>
												</label>
											{/each}
										</div>
									</div>
								{/each}
							{/if}
						{/await}
					</div>

					<div class="mt-4 flex flex-col gap-4">
						<hr class="border-gray-200" />

						<div class="flex items-center gap-2 max-md:flex-col">
							{#if data?.locals?.authenticated}
								<form method="post" action="?/cart" use:enhance class="w-full">
									<input
										type="hidden"
										name="attributes"
										value={JSON.stringify(selectedAttributes)}
									/>
									<Button
										class="w-full text-base font-semibold {isLoading
											? 'cursor-not-allowed bg-primary/50'
											: ''}"
										type="submit"
										size={'lg'}
										onclick={(e) => (isLoading = true)}>Add to cart</Button
									>
								</form>
							{:else}
								<a
									href="/signin"
									class="flex h-11 w-full items-center justify-center rounded-md bg-primary px-8 text-base font-semibold text-white"
									>Add to cart</a
								>
							{/if}
							{#if data?.locals?.authenticated}
								<form action="?/wishlist" method="post" use:enhance class="w-full">
									<input
										type="hidden"
										name="attributes"
										value={JSON.stringify(selectedAttributes)}
									/>
									<Button
										variant={'outline'}
										size={'lg'}
										type="submit"
										class="w-full border-primary text-base font-semibold"
										onclick={(e) => (isLoading = false)}>Wishlist</Button
									>
								</form>
							{:else}
								<a
									href="/signin"
									class="flex h-11 w-full items-center justify-center rounded-md border border-primary px-8 text-base font-semibold text-black"
									>Wishlist</a
								>
							{/if}
						</div>
					</div>
				</div>
			{/await}
			<div
				class="max-md:px- flex w-full justify-between rounded-lg bg-slate-100 px-16 py-4 max-md:grid max-md:grid-cols-2 max-md:gap-6"
			>
				<div class="flex flex-col items-center gap-2 text-gray-400">
					<FlaskConical strokeWidth={2} size={24} />
					<p class="text-center text-sm leading-tight">Safe & <br /> Non-Toxic</p>
				</div>
				<div class="flex flex-col items-center gap-2 text-gray-400">
					<ClipboardPlus strokeWidth={2} size={24} />
					<p class="text-center text-sm leading-tight">Dermatologist <br /> Created</p>
				</div>
				<div class="flex flex-col items-center gap-2 text-gray-400">
					<Earth strokeWidth={2} size={24} />
					<p class="text-center text-sm leading-tight">Biodegradable <br /> ingredients</p>
				</div>
				<div class="flex flex-col items-center gap-2 text-gray-400">
					<CircleCheckBig strokeWidth={2} size={24} />
					<p class="text-center text-sm leading-tight">Vegan & <br /> Cruelty-free</p>
				</div>
			</div>
		</div>
	</div>

	<div class="rounded-md border border-gray-200 p-2">
		<Tabs.Root value="details" class="w-full">
			<Tabs.List
				class="bg-transparent max-md:flex max-md:flex-wrap max-md:items-start max-md:justify-start"
			>
				<Tabs.Trigger value="details" class="data-[state=active]:bg-primary/10"
					>Details</Tabs.Trigger
				>
				<Tabs.Trigger value="benefits" class="data-[state=active]:bg-primary/10"
					>Benefits</Tabs.Trigger
				>
				<Tabs.Trigger value="howtouse" class="data-[state=active]:bg-primary/10"
					>How To Use</Tabs.Trigger
				>
				<Tabs.Trigger value="ingredients" class="data-[state=active]:bg-primary/10"
					>Ingredients</Tabs.Trigger
				>
			</Tabs.List>
			<div class="p-2">
				{#await data?.product}
					<Skeleton class="aspect-[4/4] h-full w-full rounded-xl bg-gray-200" />
				{:then product}
					<Tabs.Content value="details" class="tiptap"
						>{@html DOMPurify.sanitize(product?.product?.description)}</Tabs.Content
					>
					<Tabs.Content value="benefits" class="tiptap"
						>{@html DOMPurify.sanitize(product?.product?.benefits)}</Tabs.Content
					>
					<Tabs.Content value="howtouse" class="tiptap"
						>{@html DOMPurify.sanitize(product?.product?.howToUse)}</Tabs.Content
					>
					<Tabs.Content value="ingredients" class="tiptap"
						>{@html DOMPurify.sanitize(product?.product?.ingredients)}</Tabs.Content
					>
				{/await}
			</div>
		</Tabs.Root>
	</div>
	<div class="mb-6 grid grid-cols-8 max-md:flex max-md:flex-col max-md:gap-4">
		{#await data?.product}
			<Skeleton class="aspect-[4/4] h-full w-full rounded-xl bg-gray-200" />
		{:then product}
			<div class="col-span-2 flex flex-col gap-2">
				<p class="text-xl font-semibold">Customer Reviews</p>
				<div class="flex flex-col gap-2">
					<!-- <div class="flex items-center gap-2">
						<SvelteRating rating={+product?.product?.averageRating} config={{ size: 16 }} />
						<p>{product?.product?.averageRating} out of 5</p>
					</div> -->

					<!-- <div class="flex flex-col gap-1">
						{#each product?.product?.rating as stats}
							<div class="flex items-center gap-2">
								<SvelteRating rating={+stats?.rating} config={{ size: 16 }} />
								<div class="relative h-4 w-32 overflow-hidden rounded-sm bg-slate-200">
									<div
										class="absolute h-full rounded-sm bg-primary"
										style="width: {stats?.percentage}%;"
									></div>
								</div>
								<p class="text-sm">{stats?.count}</p>
							</div>
						{/each}
					</div> -->
				</div>
			</div>
			<div class="col-span-6 flex flex-col gap-6">
				<p class="text-xl font-semibold">Reviews</p>
				<div class="flex flex-col gap-6">
					{#if product?.product?.rating.length > 0}
						{#each product?.product?.rating.slice(0, 4) as review}
							<div class="flex w-full gap-4">
								<div class="flex w-full flex-col gap-4">
									<div class="flex items-start justify-between text-sm">
										<div>
											<p class="text-lg font-semibold">{review.user.name}</p>
											<SvelteRating rating={+review.rating} config={{ size: 16 }} />
										</div>
										<div>
											<p>{formatRelativeTime(review.updated_at)}</p>
										</div>
									</div>
									<p>
										{review.comment}
									</p>
								</div>
							</div>
						{/each}
					{:else}
						<div>
							<p class="text-gray-400">No Reviews Yet</p>
						</div>
					{/if}
				</div>
			</div>
		{/await}
	</div>
	{#await data?.product}
		<Skeleton class="aspect-[4/4] h-full w-full rounded-xl bg-gray-200" />
	{:then product}
		<div class="mb-8 flex flex-col gap-6">
			<p class="mt-4 text-2xl font-bold tracking-tight">Related Products</p>
			<div class="grid grid-cols-5 gap-4 max-sm:grid-cols-2">
				{#each product.related_products as related}
					<ProductCard
						imgUrl={related.image}
						productPrice={related.final_price}
						productTitle={related.name}
						rating={related.averageRating}
						totalReviewCount={related.totalReviewCount}
						discount={related.discount}
						productRedirectLink={`/product/${related.id}/${related.slug}`}
					/>
				{/each}
			</div>
		</div>
	{/await}
</div>

<style>
	:global(.thumbSwiper .swiper-wrapper .swiper-slide) {
		opacity: 0.4;
		transition: opacity 0.3s;
	}

	:global(.thumbSwiper .swiper-wrapper .swiper-slide-thumb-active) {
		opacity: 1;
	}

	:global {
		.tiptap hr {
			border: none;
			border-top: 1px solid #f87171;
			margin: 1rem 0;
		}
		.tiptap h1,
		.tiptap h2,
		.tiptap h3,
		.tiptap h4,
		.tiptap h5,
		.tiptap h6 {
			line-height: 120%;
			margin-top: 0.1rem;
			text-wrap: pretty;
		}
		.tiptap code {
			background-color: var(--purple-light);
			border-radius: 0.4rem;
			color: var(--black);
			font-size: 0.85rem;
			padding: 0.25em 0.3em;
		}

		.tiptap pre {
			background: var(--black);
			border-radius: 0.5rem;
			color: var(--white);
			font-family: 'JetBrainsMono', monospace;
			margin: 1.5rem 0;
			padding: 0.75rem 1rem;
		}
		.tiptap pre code {
			background: none;
			color: inherit;
			font-size: 0.8rem;
			padding: 0;
		}

		.tiptap blockquote {
			border-left: 3px solid var(--gray-3);
			margin: 1.5rem 0;
			padding-left: 1rem;
		}
		.tiptap ul {
			list-style: disc;
		}
		.tiptap ol {
			list-style: decimal;
		}
		.tiptap ul,
		.tiptap ol {
			padding: 0 1rem;
			margin: 0.2rem 0.2rem 0.2rem 0.4rem;
		}
		.tiptap ul li p,
		.tiptap ol li p {
			margin-top: 0.2em;
			margin-bottom: 0.2em;
		}
		.tiptap h1,
		.tiptap h2 {
			margin-top: 0.5rem;
			font-weight: bold;
			margin-bottom: 0.5rem;
		}

		.tiptap h1 {
			font-size: 1.4rem;
		}

		.tiptap h2 {
			font-size: 1.2rem;
		}

		.tiptap h3 {
			font-size: 1.1rem;
		}

		.tiptap h4,
		.tiptap h5,
		.tiptaph6 {
			font-size: 1rem;
		}
	}
</style>
