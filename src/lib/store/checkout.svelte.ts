import { writable } from 'svelte/store';

interface CheckoutData {
	productId: string;
	quantity: string;
	userId: string;
	product_name: string;
	product_image: string;
	product_price: number;
	product_slug: string;
	discounts: [];
	attributes: [
		{
			attribute_name: string;
			attribute_value: string;
		}
	];
}

export const checkoutData = writable<CheckoutData[]>([]);
