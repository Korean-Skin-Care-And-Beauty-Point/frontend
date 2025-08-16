<script>
	import { swiper } from '$lib/actions/swiper.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { bannerImage } = $props();
	// bannerImage
	// 	.then((e) => {
	// 		console.log(e);
	// 	})
	// 	.catch((e) => console.log(e));
</script>

<div
	class="swiper !mx-auto overflow-clip"
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
			<Skeleton class="aspect-[16/6] h-full w-full bg-gray-200" />
		{:then banners}
			{#if banners?.banners?.length > 0}
				{#each banners?.banners as banner (banner.id)}
					{#if banner?.media_type === 'image'}
						<div class="swiper-slide !w-full">
							<a href="/category/{banner?.category?.id}/{banner?.category?.slug}">
								<img
									src={banner?.image}
									alt="Slider"
									class="mx-auto aspect-[16/6] h-full !w-full max-w-screen-2xl object-cover object-center max-sm:aspect-video"
								/>
							</a>
						</div>
					{:else if banner?.media_type === 'video'}
						<div class="swiper-slide !w-full">
							<a href="/category/{banner?.category?.id}/{banner?.category?.slug}">
								<!-- svelte-ignore a11y_media_has_caption -->
								<video
									class="aspect-[16/6] h-full w-full max-w-screen-2xl object-cover object-center"
									autoplay
									muted
								>
									<source src={banner?.image} type="video/mp4" />
									Your browser does not support the video tag.
								</video>

								<!-- <img
									src={banner?.image}
									alt="Slider"
									class="mx-auto aspect-[16/6] h-full !w-full max-w-screen-2xl object-cover object-center max-sm:aspect-video"
								/> -->
							</a>
						</div>
					{/if}
				{/each}
			{:else}
				<Skeleton class="aspect-[16/6] h-full w-full rounded-xl bg-gray-200" />
			{/if}
		{/await}
	</div>
</div>
