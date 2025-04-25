<script>
	import { swiper } from '$lib/actions/swiper.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { bannerImage } = $props();
</script>

<div
	class="swiper !mx-auto max-w-[1450px] overflow-clip max-xl:px-4"
	use:swiper={{
		slidesPerView: 1,
		spaceBetween: 20,
		effect: 'fade',
		autoplay: {
			delay: 4500,
			disableOnInteraction: false
		},
		loop: true
	}}
>
	<div class="swiper-wrapper w-full">
		{#await bannerImage}
			<Skeleton class="aspect-[16/6] h-full w-full rounded-xl bg-gray-200" />
		{:then banners}
			{#if banners?.banner.length > 0}
				{#each banners?.banner as banner (banner.id)}
					<div class="swiper-slide !w-full">
						<a href="/category/{banner?.categoryId}/{banner?.category?.title}">
							<img
								src={banner?.bannerImage}
								alt="Slider"
								class="aspect-[16/6] h-full !w-full rounded-xl object-cover object-center max-sm:aspect-video"
							/>
						</a>
					</div>
				{/each}
			{:else}
				<Skeleton class="aspect-[16/6] h-full w-full rounded-xl bg-gray-200" />
			{/if}
		{/await}
	</div>
</div>
