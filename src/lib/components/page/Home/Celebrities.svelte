<script>
	import malika from '$lib/assets/img/actress/malika.png';
	import { ProductCard } from '$lib/components/ui/product-card';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { SiProducthunt } from '@icons-pack/svelte-simple-icons';

	let { celebrities } = $props();
</script>

<div class="mx-auto flex max-w-screen-2xl flex-col gap-6 px-10 py-10">
	<div>
		<p class="text-2xl font-bold tracking-tight">Celebrities Pick</p>
	</div>
	<div class="grid grid-cols-5 justify-between gap-6">
		{#await celebrities}
			{#each Array.from({ length: 5 })}
				<Skeleton class="aspect-[4/4.5] h-full w-full bg-gray-50" />
			{/each}
		{:then celebrity}
			{#each celebrity?.products as product}
				<ProductCard
					imgUrl={product.thumbnail}
					productPrice={product.price}
					productTitle={product.name}
					rating={product.averageReview}
					discount={product.discount}
					celebrityPick={product.celebrities}
					productRedirectLink={`/product/${product.id}/${product.slug}`}
				/>
			{/each}
		{/await}
	</div>
</div>
