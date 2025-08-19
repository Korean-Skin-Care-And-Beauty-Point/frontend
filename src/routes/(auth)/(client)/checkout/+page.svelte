<script lang="ts">
	import { pageTitle } from '$lib/store/pageTitle.svelte';
	$pageTitle.title = 'Checkout';
	import { checkoutData } from '$lib/store/checkout.svelte.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { Banknote } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	const price = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'NPR'
	});
	let checkoutItems: any = [];
	let totalProduct = $state(0);
	let discount = $state(false);
	let totalDiscount = $state(0);
	let subTotal = $state(0);
	let totalPrice = $state(0);
	let shippingFee = $state(0);
	let voucher = $state(0);
	let selectedAttributes = $state({});
	let paymentMethod = $state('');

	let taxAmount = $state(0);
	let serviceCharge = $state(0);
	let deliveryCharge = $state(0);

	onMount(() => {
		if ($checkoutData.length === 0) {
			goto('/cart', {
				replaceState: true,
				invalidateAll: true,
				noScroll: true
			});
		}
	});

	function updateSelectedAttribute(title: any, value: any) {
		selectedAttributes = { ...selectedAttributes, [title]: value };
	}

	$inspect($checkoutData);

	function calculateTotalDiscount() {
		return $checkoutData.reduce((total: number, item: any) => {
			// if (item.discounts.length > 0) {
			// 	// const discountAmount = (item.product.discount / 100) * item.product.price;
			// 	// return total + discountAmount * item.quantity;
			// 	return total * item.quantity;
			// }
			return total * item.quantity;
		}, 0);
	}

	function calculateSubtotal() {
		return $checkoutData.reduce((total: number, item: any) => {
			return total + item.product_price * item.quantity;
		}, 0);
	}
	$effect(() => {
		totalDiscount = calculateTotalDiscount();
		subTotal = calculateSubtotal() - calculateTotalDiscount();
		totalPrice = subTotal + shippingFee - voucher;
		discount = $checkoutData.some((item) => item.discounts.length > 0);
	});

	const paymentOption = [
		{
			title: 'Cash On Delivery',
			value: 'cod',
			icon: Banknote
		},
		{
			title: 'Esewa',
			value: 'esewa'
		},
		{
			title: 'Khalti',
			value: 'khalti'
		}
	];

	function paymentValue(value: string) {
		paymentMethod = value;
	}
</script>

<div class="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 px-12 py-4 max-md:px-2">
	<p class="text-3xl font-semibold tracking-tight">Checkout</p>
	<div class="grid grid-cols-8 gap-16 py-2">
		<div class="col-span-4">
			<div class="flex flex-col gap-4">
				<p class="text-xl font-semibold tracking-tight">Payment Options</p>
				<div class="flex w-full gap-2">
					<Accordion.Root type="single" class="!w-full rounded-md border border-gray-300">
						{#each paymentOption as payment}
							<Accordion.Item
								value={payment.value}
								onclick={(e) => paymentValue(payment.value)}
								class="!w-full border-gray-300 px-4 last:border-b-0"
							>
								<Accordion.Trigger class="justify-start gap-4 last:border-b-0">
									<div
										class="aspect-square h-5 w-5 rounded-full border border-gray-300 {paymentMethod ===
										payment.value
											? 'relative rounded-full border-primary after:absolute after:left-1/2 after:top-1/2 after:aspect-square after:h-2.5 after:w-2.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-primary after:content-[""]'
											: ''}"
									></div>
									{payment.title}
								</Accordion.Trigger>
								{#if paymentMethod !== 'COD'}
									<Accordion.Content>This is payment method</Accordion.Content>
								{/if}
							</Accordion.Item>
						{/each}
					</Accordion.Root>
					<!-- {#each paymentOption as payment}
						<label for={payment.title} class="group flex w-full cursor-pointer">
							<input
								type="radio"
								name="paymentMethod"
								id={payment.title}
								value={payment.value}
								class="peer invisible absolute"
								onchange={() => {
									updateSelectedAttribute(payment.title, payment.value);
								}}
							/>
							<div
								class="w-full rounded-md border border-zinc-300 px-1.5 py-2 text-center text-sm font-medium peer-checked:border-0
								peer-checked:bg-primary/5
								peer-checked:outline
								peer-checked:outline-primary
								"
							>
								{payment.title}
							</div>
						</label>
					{/each} -->
				</div>
				<form method="post" use:enhance>
					{#each $checkoutData as item}
						<input type="hidden" name="product[]" value={item} />
						<input type="hidden" name="productId[]" value={item?.productId} />
						<input type="hidden" name="attributes[]" value={item?.attributes} />
						<input type="hidden" name="user" value={item?.userId} />
						<input type="hidden" name="quantity[]" value={item?.quantity} />
					{/each}
					<input type="hidden" name="paymentMethod" value={paymentMethod} />
					{#if paymentMethod === 'ESEWA'}
						<input type="hidden" name="amount" value={subTotal} />
						<input type="hidden" name="tax_amount" value={taxAmount} />
						<input type="hidden" name="total_amount" value={totalPrice} />
						<input type="hidden" name="service_charge" value={serviceCharge} />
						<input type="hidden" name="delivery_charge" value={deliveryCharge} />
					{/if}
					<Button type="submit">Continue With Purchase</Button>
				</form>
			</div>
		</div>

		<div class="col-span-4 flex flex-col gap-3">
			<p class="text-xl font-semibold tracking-tight">Product Details</p>

			<div
				class="flex w-full flex-col justify-between gap-6 border-b py-2 max-md:flex-col max-md:px-3 max-md:py-4"
			>
				{#each $checkoutData as item}
					<div class="flex w-full gap-4 max-md:gap-2">
						<div class="flex w-full items-start gap-4 text-base max-md:gap-2">
							<div>
								<img
									src={item?.product_image}
									alt={item?.product_name}
									class="aspect-square h-full w-16 rounded-md object-contain object-center"
								/>
							</div>
							<div class="flex w-full items-start justify-between">
								<div class="flex flex-col gap-0 max-md:gap-0">
									<p class="line-clamp-2 text-xl font-semibold max-md:text-sm">
										{item?.product_name}
									</p>
									<div class="flex items-center gap-1.5">
										{#each item?.attributes as attribute}
											<p class="text-xs font-normal text-gray-400">
												{attribute.attribute_name} <span>:</span>
												<span>{attribute.attribute_value}</span>
											</p>
										{/each}
									</div>
								</div>
								<div class="flex flex-col items-end gap-0 max-md:items-start">
									<!-- <p class="text-lg font-semibold tracking-tight text-primary max-md:text-base">
										{price
											.format(
												discount
													? item?.product_price -
															(item?.discounts / 100) * item?.product?.price
													: item?.product?.price
											)
											.replace('NPR', 'Rs.')}
									</p> -->
									{#if discount}
										<div class="flex items-end gap-0">
											<p
												class="text-base font-medium tracking-tight text-red-200 line-through max-md:text-sm"
											>
												{price.format(item?.product_price).replace('NPR', 'Rs.')}
											</p>
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="flex flex-col gap-2 border-b pb-2">
				<div class="flex items-center justify-between">
					<p class="font-medium tracking-tight">Subtotal</p>
					<p>{price.format(subTotal).replace('NPR', 'Rs.')}</p>
				</div>
				<div class="flex items-center justify-between">
					<p class="font-medium tracking-tight">Shipping fee</p>
					<p>{price.format(0).replace('NPR', 'Rs.')}</p>
				</div>
			</div>
			<div class="flex items-center justify-between">
				<p class="text-lg font-semibold tracking-tight">Total</p>
				<p class="text-lg font-semibold tracking-tight">
					{price.format(totalPrice).replace('NPR', 'Rs.')}
				</p>
			</div>
		</div>
	</div>
</div>
