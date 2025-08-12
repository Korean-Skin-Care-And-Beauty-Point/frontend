<script>
	import SvelteRating from '$lib/components/ui/rating';
	let {
		imgUrl,
		rating = 0,
		productTitle = '',
		productRedirectLink = '',
		discount = 0,
		productPrice,
		flashSale = false,
		celebrityPick = [],
		totalReviewCount = 0
		// discountPrice = 0
	} = $props();

	const price = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'NPR'
	});

	let discountPrice = productPrice - (discount / 100) * productPrice;
	// let priceProduct = discount === 0 ? price.format(productPrice) : price.format(discountPrice);
</script>

<a
	href={productRedirectLink}
	class="h-full {flashSale ? '!rounded-b-lg rounded-t-full' : 'rounded-lg'}"
>
	<div
		class="flex h-full flex-col justify-between gap-3 border border-neutral-200 bg-white p-2 {flashSale
			? '!rounded-b-lg rounded-t-full'
			: 'rounded-lg'}"
	>
		<div class="relative w-full">
			<img
				src={imgUrl}
				alt={productTitle}
				class="aspect-square h-full w-full {flashSale
					? '!rounded-b-md rounded-t-full'
					: 'rounded-md'} object-cover object-center"
			/>
			{#if discount}
				<p
					class="absolute bottom-2 right-2 rounded-sm bg-primary px-2 py-0.5 text-sm font-semibold tracking-tight text-white shadow-md shadow-primary/35"
				>
					{discount}% OFF
				</p>
			{/if}
		</div>
		<div class="flex flex-col gap-1">
			<div class="flex flex-col gap-1">
				{#if celebrityPick.length > 0}
					<div class="mb-1 flex items-center gap-1">
						<p class="text-xs">Picked by:</p>
						<div class="flex">
							{#each celebrityPick as celebrity}
								<div class="flex flex-col items-center">
									{#if celebrity?.profileImage}
										<img
											src={celebrity?.profileImage}
											alt="{celebrity?.fullName} avatar"
											class="-mr-1 aspect-square h-5 w-5 rounded-full object-cover object-center"
										/>
									{:else}
										<p
											class="-mr-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs"
										>
											{celebrity?.fullName.slice(0, 1)}
										</p>
									{/if}
								</div>
								<!-- <img
									src={celebrity.profileImage}
									alt={celebrity.fullName}
									class="-mr-2 h-6 w-6 rounded-full border-2 border-white object-contain object-center"
								/> -->
							{/each}
						</div>
					</div>
				{/if}
				<p class="line-clamp-2 font-semibold leading-5 tracking-tight">{productTitle}</p>
				<div class="flex items-center gap-1">
					<SvelteRating {rating} config={{ size: 16 }} />
					{#if totalReviewCount > 0}
						<p class="text-sm text-gray-500">({totalReviewCount})</p>
					{/if}
				</div>
			</div>
			<div class="flex items-center gap-2 max-lg:flex-col max-lg:items-start max-lg:gap-0">
				<p class="text-lg font-semibold tracking-tight text-primary">
					{price.format(discount ? discountPrice : productPrice).replace('NPR', 'Rs.')}
				</p>
				{#if discount}
					<p class="text-sm font-medium tracking-tight text-red-200 line-through">
						{price.format(productPrice).replace('NPR', 'Rs.')}
					</p>
				{/if}
			</div>
		</div>
	</div>
</a>
