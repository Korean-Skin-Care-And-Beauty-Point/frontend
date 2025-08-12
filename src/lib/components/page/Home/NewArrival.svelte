<script>
	import malika from '$lib/assets/img/actress/malika.png';
	import { ProductCard } from '$lib/components/ui/product-card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	const celebrity = [
		{
			name: 'Malika Mahat',
			img: malika
		},
		{
			name: 'Malika Mahat',
			img: malika
		}
	];

	let { products } = $props();

	// products
	// 	.then((e) => {
	// 		console.log(e);
	// 	})
	// 	.catch((e) => console.log(e));
</script>

<div
	class="mx-auto flex max-w-screen-2xl flex-col gap-6 bg-primary/10 px-10 py-10 max-sm:gap-2 max-sm:px-4"
>
	<div>
		<p class="text-2xl font-bold tracking-tight max-sm:text-xl">New Arrivals</p>
	</div>
	<div class="grid grid-cols-5 justify-between gap-6 max-sm:grid-cols-2 max-sm:gap-2">
		{#await products}
			{#each Array.from({ length: 10 })}
				<Skeleton class="aspect-[4/4.5] h-full w-full bg-gray-50" />
			{/each}
		{:then product}
			{#if product?.newArrival?.product?.length > 0}
				{#each product?.newArrival?.product as newArrival}
					<ProductCard
						imgUrl={newArrival?.image}
						productPrice={newArrival?.price}
						productTitle={newArrival?.name}
						rating={newArrival?.averageReview}
						discount={newArrival?.discount}
						productRedirectLink={`/product/${newArrival?.id}/${newArrival?.slug}`}
						totalReviewCount={newArrival?.totalReviewCount}
						celebrityPick={newArrival?.pickedByCelebrities}
					/>
				{/each}
			{:else}
				{#each Array.from({ length: 10 })}
					<Skeleton class="aspect-[4/4.5] h-full w-full bg-gray-50" />
				{/each}
			{/if}
		{/await}
	</div>
</div>
