import { VITE_BACKEND_URL } from '$env/static/private';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { endpoints } from '$lib/utils/api';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	try {
		const response = await fetch(`${VITE_BACKEND_URL}${endpoints.cart.getCart}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('accessToken')}`,
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			error(401, 'Unauthorized');
		}

		return {
			cart: response.json(),
			message: 'Cart successfully fetched',
			status: 'success'
		};
	} catch (err) {
		return {
			// @ts-expect-error as message is an empty object
			message: err.message,
			status: 'error'
		};
	}
};

export const actions: Actions = {
	deleteProducts: async ({ request, fetch, cookies }) => {
		try {
			const formData = await request.formData();
			const productId = formData.getAll('cartItemsIds[]').map((id) => Number(id));

			console.log(productId);

			if (!Array.isArray(productId)) {
				return fail(400, { message: 'Invalid productIds format', status: 'error' });
			}

			const response = await fetch(`${VITE_BACKEND_URL}${endpoints.cart.deleteAllProduct}`, {
				body: JSON.stringify({ productId }),
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.get('accessToken')}`
				}
			});

			console.log(await response.text());

			return { message: 'Products deleted successfully', status: 'success' };
		} catch (error) {
			console.error('Error deleting products:', error);
			return fail(500, { message: 'Unable to delete products', status: 'error' });
		}
	},

	deleteAProduct: async ({ request, fetch, cookies }) => {
		try {
			const formData = await request.formData();
			const productId = formData.get('productId') as string;

			await fetch(`${VITE_BACKEND_URL}${endpoints.cart.deleteAproduct(productId)}`, {
				body: JSON.stringify(productId),
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.get('accessToken')}`,
					Accept: 'application/json'
				}
			});
			return { message: 'Product deleted successfully', status: 'success' };
		} catch (error) {
			console.error('Error deleting product:', error);
			return fail(500, { message: 'Unable to delete products', status: 'error' });
		}
	}
};
