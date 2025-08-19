<script lang="ts">
	import { pageTitle } from '$lib/store/pageTitle.svelte';
	import malika from '$lib/assets/img/actress/malika.png';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import StarRating from '$lib/components/ui/rating/StarRating.svelte';
	import { Trash } from 'lucide-svelte';
	import { ProductCard } from '$lib/components/ui/product-card/index.js';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import Pencil from 'lucide-svelte/icons/pencil';
	import QuantityCounter from '$lib/components/Extra/QuantityCounter.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { checkoutData } from '$lib/store/checkout.svelte.js';
	import { afterNavigate, goto, invalidate, invalidateAll } from '$app/navigation';

	$pageTitle.title = 'Cart';

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
	let quantities = $state.raw({});

	let { data, form } = $props();

	// data.cart?.then((e) => console.log(e)).catch((e) => console.log(e));

	const price = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'NPR'
	});

	function updateTotals() {
		if (selected.length === 0) {
			totalDiscount = 0;
			subTotal = 0;
			totalPrice = 0;
		} else {
			totalDiscount = selected.reduce(
				(
					total: number,
					item: { discounts: string | any[]; product_price: number; id: string; quantity: number }
				) => {
					// const quantity = quantities[item.id] || item.quantity;
					if (item.discounts?.length > 0) {
						const discount = item.discounts[0];
						const discountAmount = (discount.discount_amount / 100) * item.product_price;
						return total + discountAmount * item.quantity;
					}
					return total;
				},
				0
			);

			subTotal = selected.reduce(
				(
					total: number,
					item: { product_price: number; quantity: number; id: string; discounts: string | any[] }
				) => {
					// const quantity = quantities[item.id] || item.quantity;
					const basePrice = item.product_price * item.quantity;
					if (item.discounts?.length > 0) {
						const discount = item.discounts[0];
						return (
							total + item.product_price * (1 - discount.discount_amount / 100) * item.quantity
						);
					}
					return total + basePrice;
				},
				0
			);

			totalPrice = subTotal + shippingFee - voucher;
		}
	}

	$effect(() => {
		data?.cart
			?.then((e) => {
				console.log(e);
				products = e.cart.items;
				selected = [];
				totalProduct = e.cart.items.length;
				deleteSelected = [...e.cart.items];

				discount = e.carts.items.some(
					(item: { discounts: Array<any> }) => item.discounts.length > 0
				);
				updateTotals();
			})
			.catch((e) => console.log(e));

		// if (form?.status === 'success') {
		// 	toast.success(form?.message);
		// 	// invalidateAll();
		// 	invalidate('/cart');
		// } else if (form?.status === 'error') {
		// 	toast.error(form?.message);
		// }
	});

	afterNavigate(({ from, to }) => {
		if (form?.status === 'success') {
			toast.success(form?.message);
		} else if (form?.status === 'error') {
			toast.error(form?.message);
		}
	});

	function toggleAll(e: any) {
		if (e) {
			selected = [...products];
		} else {
			selected = [];
		}
		updateTotals();
	}

	function toggleItem(item: any) {
		if (selected.includes(item)) {
			selected = selected.filter((i: any) => i !== item);
		} else {
			selected = [...selected, item];
		}
		updateTotals();
	}
	function isAllSelected() {
		return selected.length === products.length && products.length > 0;
	}

	function proceedToCheckout() {
		if (selected.length > 0) {
			console.log(selected);
			checkoutData.set(selected);
			goto('/checkout');
		} else {
			toast.error('Please select at least one product to checkout');
		}
	}
</script>

<div class="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 px-12 py-4 max-md:px-2">
	<div class="grid h-auto grid-cols-8 gap-6 max-lg:gap-4 max-md:grid-cols-1">
		<div
			class="col-span-6 h-fit rounded-md border border-gray-300 max-lg:col-span-5 max-md:col-span-full"
		>
			<div class="flex flex-col">
				<div class="flex w-full justify-between border-b border-gray-300 px-4 py-3">
					<div class="flex items-center gap-2">
						<Checkbox
							id="all"
							checked={isAllSelected()}
							onCheckedChange={toggleAll}
							disabled={totalProduct === 0}
						/>
						<Label for="all" class="cursor-pointer font-normal">Select All ({totalProduct})</Label>
					</div>
					<form method="POST" use:enhance action="?/deleteProducts">
						{#each deleteSelected as item}
							<input type="hidden" name="cartItemsIds[]" value={item.id} />
						{/each}
						<button
							class="flex cursor-pointer items-center gap-1"
							disabled={selected.length === 0}
							type="submit"
						>
							<Trash size={18} strokeWidth={1.5} />
							<Label for="deleteAll" class="cursor-pointer font-normal">Delete All</Label>
						</button>
					</form>
				</div>

				<div>
					{#await data?.cart}
						<div class="flex w-full flex-col gap-2">
							{#each Array.from({ length: 4 })}
								<Skeleton class="h-32 w-full bg-gray-100" />
							{/each}
						</div>
					{:then cartProduct}
						{#if cartProduct}
							{#if cartProduct.cart.items.length > 0}
								<div class="flex flex-col gap-2">
									{#each cartProduct.cart.items as cart, index}
										<div
											class="flex w-full justify-between border-b px-4 py-4 last:border-b-0 max-md:flex-col max-md:px-3 max-md:py-4"
										>
											<div class="flex w-full gap-3 max-md:gap-2">
												<Checkbox
													id={index.toString()}
													checked={selected.includes(cart)}
													onCheckedChange={() => toggleItem(cart)}
												/>
												<Label
													for={index.toString()}
													class="flex w-full gap-4 text-base max-md:items-start max-md:gap-2"
												>
													<div>
														<img
															src={cart?.product_image}
															alt={cart?.product_name}
															class="aspect-square h-full w-28 rounded-md object-contain object-center"
														/>
													</div>
													<div class="flex w-full flex-col justify-between">
														<div class="flex flex-col gap-0 max-md:gap-0">
															<a
																href="/product/{cart?.product_id}/{cart?.product_slug}"
																class="line-clamp-2 text-lg font-semibold max-md:text-sm"
															>
																{cart?.product_name}
															</a>
															<div class="flex items-center gap-1.5">
																{#each cart?.attributes as attribute}
																	<p class="text-sm font-normal text-gray-400">
																		{attribute.attribute_name} <span>:</span>
																		<span>{attribute.attribute_value}</span>
																	</p>
																{/each}
																<!--<div class="max-md:hidden">
																{cart?.averageReview}
																<StarRating
																	rating={+cart?.product?.averageReview}
																	config={{ size: 14 }}
																/>
															</div>
															<div class="md:hidden">
																<StarRating
																	rating={+cart?.product?.averageReview}
																	config={{ size: 12 }}
																/>
															</div> -->
																<!-- <p class="text-sm font-normal text-gray-400 max-md:text-xs">
																{#if cart?.product?.totalReviewCount > 0}
																	{cart?.product?.totalReviewCount > 1 ? 'Reviews' : 'Review'}
																{:else}
																	No Review
																{/if}
															</p> -->
															</div>
														</div>
														<div
															class="mt-4 flex items-center gap-3 max-md:flex-col max-md:items-start"
														>
															<p
																class="text-xl font-semibold tracking-tight text-primary max-md:text-lg"
															>
																{price
																	.format(
																		cart.discounts?.length > 0
																			? cart.product_price -
																					(cart.discounts[0].discount_amount / 100) *
																						cart.product_price
																			: cart.product_price
																	)
																	.replace('NPR', 'Rs.')}
															</p>
															{#if cart.discounts?.length > 0}
																<div class="flex items-center gap-2">
																	<p
																		class="text-lg font-medium tracking-tight text-red-200 line-through max-md:text-lg"
																	>
																		{price.format(cart?.product_price).replace('NPR', 'Rs.')}
																	</p>
																	<p
																		class="rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-white max-md:text-xs"
																	>
																		{cart.discounts[0].discount_amount}% OFF
																	</p>
																</div>
															{/if}
														</div>
													</div>
												</Label>
											</div>
											<div class="flex flex-col items-end justify-between">
												<AlertDialog.Root>
													<AlertDialog.Trigger
														class="rounded-md p-2 hover:bg-primary/10 max-md:hidden"
													>
														<Trash size={20} strokeWidth={1.5} color="#AF272F" />
													</AlertDialog.Trigger>
													<AlertDialog.Content>
														<AlertDialog.Header>
															<AlertDialog.Title>Are you sure to delete the item?</AlertDialog.Title
															>
															<AlertDialog.Description>
																You are about to delete item from your cart.
															</AlertDialog.Description>
														</AlertDialog.Header>
														<AlertDialog.Footer>
															<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
															<form action="?/deleteAProduct" method="post" use:enhance>
																<input type="hidden" name="productId" value={cart?.id} />
																<button>
																	<AlertDialog.Action>Continue</AlertDialog.Action>
																</button>
															</form>
														</AlertDialog.Footer>
													</AlertDialog.Content>
												</AlertDialog.Root>

												<div>
													<QuantityCounter bind:quantity={cart.quantity} />
												</div>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<div class="flex items-center justify-center py-4">
									<p class="py-4 text-center">No Product in cart</p>
								</div>
							{/if}
						{/if}
					{/await}
				</div>
			</div>
		</div>

		<div
			class="col-span-2 h-fit rounded-md border border-gray-300 max-lg:col-span-3 max-md:col-span-full"
		>
			<form class="flex flex-col gap-3 p-4">
				{#await data?.cart}
					<p>Loading...</p>
				{:then cart}
					<div>
						<p class="text-sm text-gray-400">Location</p>
						{#if cart?.address && cart?.province}
							<p class="text-lg font-semibold">{cart?.address}, {cart?.province}</p>
						{:else}
							<a href="/me/profile" class="flex items-center gap-1"
								><Pencil size={16} /> Set Location
							</a>
						{/if}
					</div>
				{/await}

				<hr />
				<div class="flex flex-col gap-2">
					<p class="text-lg font-semibold">Order Summary</p>
					<div class="flex flex-col gap-1">
						<div class="flex items-center justify-between">
							<p>Subtotal ({selected.length} {selected.length > 0 ? 'items' : 'item'})</p>
							<p>
								{price.format(subTotal).replace('NPR', 'Rs.')}
							</p>
						</div>
						<div class="flex items-center justify-between">
							<p>Shipping Fees</p>
							<p>Rs. 0</p>
						</div>
					</div>
				</div>
				<hr />
				<div
					class="flex w-full items-center gap-1 rounded-lg border-[1.6px] border-rose-200 p-1 pl-4 focus-within:border-primary max-md:flex-col max-md:pl-1 max-sm:gap-2"
				>
					<input
						type="text"
						placeholder="Enter voucher code"
						class="w-full text-sm tracking-tight focus-visible:outline-none focus-visible:ring-0 max-md:pl-2 max-sm:py-2 max-xs:text-sm"
					/>
					<button
						class="rounded-md bg-primary px-4 py-2 text-sm font-semibold tracking-tight text-white max-md:w-full max-xs:text-xs"
						type="button">Apply</button
					>
				</div>
				<hr />
				<div>
					<div class="flex items-center justify-between">
						<p class="text-lg font-semibold">Total</p>
						<p class="text-lg font-semibold text-primary">
							{price.format(totalPrice).replace('NPR', 'Rs.')}
						</p>
					</div>
				</div>
				<Button class="text-base" onclick={proceedToCheckout}>Proceed to checkout</Button>
			</form>
		</div>
	</div>

	<!-- <div class="mb-8 flex flex-col gap-6">
		<p class="mt-4 text-2xl font-bold tracking-tight">Related Products</p>
		<div class="grid grid-cols-5 gap-4 max-sm:grid-cols-2">
			{#each Array.from({ length: 10 })}
				<ProductCard
					imgUrl={malika}
					productPrice={2500}
					productTitle={'Sunscreen PFS++++'}
					rating={2}
					discount={0}
					productRedirectLink={`/product/1/sunscreen`}
				/>
			{/each}
		</div>
	</div> -->
</div>
