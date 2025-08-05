import { VITE_BACKEND_URL } from '$env/static/private';
import { endpoints } from '$lib/utils/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, fetch }) => {
	try {
		const category = await fetch(`${VITE_BACKEND_URL}${endpoints.category.categories}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		return {
			locals,
			category: category.json()
		};
	} catch (err) {
		return {
			status: 'error',
			message: err
		};
	}
};
