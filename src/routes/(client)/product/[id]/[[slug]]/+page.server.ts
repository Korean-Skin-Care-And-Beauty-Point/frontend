import { VITE_BACKEND_URL } from '$env/static/private';
import { endpoints } from '$lib/utils/api';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	try {
		const productId = params.id;

		const product = await fetch(
			`${VITE_BACKEND_URL}${endpoints.product.individualProduct(productId)}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			}
		);

		return {
			status: 'success',
			product: product.json()
		};
	} catch (err) {
		return {
			status: 'error',
			message: err
		};
	}
};

export const actions: Actions = {
	cart: async ({ request, params, fetch, cookies }) => {
		try {
			const formData = await request.formData();
			const productId = params.id;
			const attributes = JSON.parse(formData.get('attributes') as string);

			console.log(productId);

			const formattedAttributes = Object.entries(attributes).map(
				([attribute_id, attribute_value_id]) => ({
					attribute_id: parseInt(attribute_id),
					attribute_value_id: parseInt(attribute_value_id as string)
				})
			);

			const formBody = JSON.stringify({
				product_id: parseInt(productId),
				quantity: 1,
				attributes: formattedAttributes
			});

			const response = await fetch(`${VITE_BACKEND_URL}${endpoints.cart.storeCart}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.get('accessToken')}`,
					Accept: 'application/json'
				},
				body: formBody
			});

			if (!response.ok) {
				return {
					CartStatus: 'error',
					CartMessage: 'Problem while adding item in cart'
				};
			}

			return {
				CartStatus: 'success',
				CartMessage: 'Product added to cart successfully'
			};
		} catch (err) {
			console.log(err);
			return {
				CartStatus: 'error',
				CartMessage: err || 'An error occurred'
			};
		}
	},

	wishlist: async ({ request, params, fetch, cookies }) => {
		try {
			const formData = await request.formData();
			const productId = params.id;
			const attributes = JSON.parse(formData.get('attributes') as string);

			const arrayAttributes = Object.keys(attributes).map((title) => ({
				title,
				value: attributes[title]
			}));

			const response = await fetch(`${VITE_BACKEND_URL}${endpoints.profile.wishlist}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${cookies.get('accessToken')}`
				},
				body: JSON.stringify({ productId, attributes: arrayAttributes })
			});

			return {
				status: 'success',
				message: await response.json()
			};
		} catch (err) {
			return {
				message: err,
				status: 'error'
			};
		}
	}
};
