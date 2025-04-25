<script>
	import malika from '$lib/assets/img/actress/malika.png';
	import { ProductCard } from '$lib/components/ui/product-card';

	let { sales } = $props();
</script>

<div class="mx-auto flex max-w-screen-2xl flex-col gap-6 bg-primary/10 px-10 py-10">
	<div>
		<p class="text-2xl font-bold tracking-tight">Flash Sale:</p>
		<div></div>
	</div>
	<div class="grid grid-cols-5 justify-between gap-6">
		{#await sales}
			<div></div>
		{:then sale}
			{#each sale?.data as saleItem}
				<ProductCard
					imgUrl={saleItem?.product?.image}
					productRedirectLink="/product/{saleItem?.product?.id}/{saleItem?.product?.slug}"
					productPrice={saleItem?.product?.price}
					productTitle={saleItem?.product?.name}
					rating={saleItem?.product?.averageReview}
					discount={saleItem?.discount?.discount}
					flashSale
				/>
			{/each}
		{/await}
	</div>
</div>
