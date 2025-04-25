import { writable } from 'svelte/store';

interface CheckoutData {
    productId: string;
    quantity: string;
    userId: string;
    product: {
        id: string;
        image: string;
        name: string;
        price: number;
        discount: number;
    };
    attributes: string;
}

export const checkoutData = writable<CheckoutData[]>([]);
