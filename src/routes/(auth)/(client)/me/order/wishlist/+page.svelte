<script lang="ts">
	import { enhance } from '$app/forms';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { pageTitle } from '$lib/store/pageTitle.svelte';
	import { Trash } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	$pageTitle.title = 'Wishlist';

	const { data, form } = $props();

	let product = $state();
	let selected = $state.raw([]) as any;
	let products = $state.raw([]);
	let deleteSelected = $state.raw([]) as any;
	let totalProduct = $state(0);
	let discount = $state(false);
	let totalDiscount = $state(0);
	let subTotal = $state(0);
	let shippingFee = $state(0);
	let voucher = $state(0);
	let totalPrice = $state(0);
	let quantity = $state(0);

	$effect(() => {
		data?.wishlist
			?.then((e) => {
				console.log(e);
				// products = e.product;
				// selected = [];
				// totalProduct = e.product.length;
				// deleteSelected = [...e.product];

				discount = e.product.some(
					(item: { product: { discount: number } }) => item.product.discount > 0
				);
			})
			.catch((e) => console.log(e));

		if (form?.status === 'success') {
			toast.success(form?.message);
		} else if (form?.status === 'error') {
			toast.error(form?.message);
		}
	});

	const price = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'NPR'
	});
</script>

<div class="flex flex-col gap-4">
	<p class="text-xl font-bold tracking-tight">Wishlist</p>
	<div>
		{#await data?.wishlist}
			<div class="flex flex-col gap-2">
				{#each Array.from({ length: 2 })}
					<Skeleton class="h-24 w-full bg-gray-100" />
				{/each}
			</div>
		{:then wishlists}
			{#if wishlists}
				{#if wishlists?.product.length > 0}
					<div class="flex flex-col gap-2">
						{#each wishlists?.product as wishlist}
							<div
								class="flex w-full justify-between rounded-md border border-gray-200 px-2 py-3 max-md:flex-col max-md:px-3 max-md:py-4"
							>
								<div class="flex w-full gap-4 max-md:gap-2">
									<div class="flex w-full gap-4 text-base max-md:items-start max-md:gap-2">
										<div>
											<img
												src={wishlist?.product?.image}
												alt={wishlist?.product?.name}
												class="aspect-square h-full w-28 rounded-md object-contain object-center"
											/>
										</div>
										<div class="flex w-full flex-col justify-between">
											<div class="flex flex-col gap-0 max-md:gap-0">
												<a
													href="/product/{wishlist?.product?.id}/{wishlist?.product?.slug}"
													class="line-clamp-2 text-lg font-semibold max-md:text-sm"
												>
													{wishlist?.product?.name}
												</a>
												<div class="flex items-center gap-1.5">
													{#each JSON.parse(wishlist?.attributes) as attribute}
														<p class="text-sm font-normal text-gray-400">
															{attribute.title}<span>:</span> <span>{attribute.value}</span>
														</p>
													{/each}
												</div>
											</div>
											<div class="mt-4 flex items-center gap-3 max-md:flex-col max-md:items-start">
												<p class="text-xl font-semibold tracking-tight text-primary max-md:text-lg">
													{price
														.format(
															discount
																? wishlist?.product?.price -
																		(wishlist?.product?.discount / 100) * wishlist?.product?.price
																: wishlist?.product?.price
														)
														.replace('NPR', 'Rs.')}
												</p>
												{#if discount}
													<div class="flex items-center gap-2">
														<p
															class="text-lg font-medium tracking-tight text-red-200 line-through max-md:text-lg"
														>
															{price.format(wishlist?.product?.price).replace('NPR', 'Rs.')}
														</p>
														<p
															class="rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-white max-md:text-xs"
														>
															{wishlist?.product?.discount}% OFF
														</p>
													</div>
												{/if}
											</div>
										</div>
									</div>
								</div>
								<div class="flex flex-col items-end justify-between">
									<form method="post" use:enhance>
										<input type="hidden" name="wishlistId" value={wishlist?.id} />
										<button class="rounded-md p-2 hover:bg-primary/10 max-md:hidden">
											<Trash size={20} strokeWidth={1.5} color="#AF272F" />
										</button>
									</form>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="rounded-md border border-gray-200 px-2 py-6">
						<p class="text-center text-sm text-gray-400">No Product in wishlist</p>
					</div>
				{/if}
			{/if}
		{/await}
	</div>
</div>
