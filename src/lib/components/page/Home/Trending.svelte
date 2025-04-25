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
</script>

<div class="mx-auto flex max-w-screen-2xl flex-col gap-6 px-10 py-10">
	<div>
		<p class="text-2xl font-bold tracking-tight">Trending Now</p>
	</div>
	<div class="grid grid-cols-5 justify-between gap-6">
		{#await products}
			{#each Array.from({ length: 10 })}
				<Skeleton class="aspect-[4/5] h-full w-full bg-gray-50" />
			{/each}
		{:then product}
			{#if product?.data.length > 0}
				{#each product?.data.slice(0, 10) as trending}
					<ProductCard
						imgUrl={trending?.imageUrl}
						productPrice={trending?.price}
						productTitle={trending?.name}
						rating={trending?.averageReview}
						discount={trending?.discount}
						celebrityPick={celebrity}
						productRedirectLink={`/product/${trending?.id}/${trending?.slug}`}
					/>
				{/each}
			{:else}
				{#each Array.from({ length: 10 })}
					<Skeleton class="aspect-[4/5] h-full w-full bg-gray-50" />
				{/each}
			{/if}
		{/await}
	</div>
</div>
