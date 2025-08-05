<script>
	import {
		HeroSlider,
		Recommended,
		FlashSale,
		CelebritiesPick,
		NewArrival,
		TrendingNow
	} from '$lib/components';
	import { pageTitle } from '$lib/store/pageTitle.svelte';
	$pageTitle.title = 'Korean Skin Care and Beauty Point';

	let { data } = $props();
</script>

<div>
	<HeroSlider bannerImage={data?.banner} />
	<!-- <Recommended recommend={data?.recommended} />
	{#await data?.flashSale then flashSale}
		{#if flashSale?.data.length > 0}
			<FlashSale sales={data?.flashSale} />
		{/if}
	{/await} -->
	<!-- <CelebritiesPick celebrities={data?.celebrity} /> -->
	<NewArrival products={data?.newArrival} />
	{#await data?.trending then trendingProduct}
		{#if trendingProduct?.data?.length > 0}
			<TrendingNow products={data?.trending} />
		{/if}
	{/await}
</div>
