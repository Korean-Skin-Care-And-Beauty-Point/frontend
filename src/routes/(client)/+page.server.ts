import type { PageServerLoad } from './$types';
import { VITE_BACKEND_URL } from '$env/static/private';
import { endpoints } from '$lib/utils/api';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const banner = await fetch(`${VITE_BACKEND_URL}${endpoints.category.banner}`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const newArrivals = await fetch(`${VITE_BACKEND_URL}${endpoints.product.newArrival}`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		const trendingProduct = await fetch(`${VITE_BACKEND_URL}${endpoints.product.trending}`, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		const celebrity = await fetch(`${VITE_BACKEND_URL}${endpoints.profile.celebrity}`, {
			headers: {
				Accept: 'application/json'
			}
		});

		// const recommended = await fetch(`${VITE_BACKEND_URL}${endpoints.product.recommended}`, {
		//     headers: {
		//         'Content-Type': "application/json"
		//     }
		// });

		// const flashSale = await fetch(`${VITE_BACKEND_URL}${endpoints.product.flashSale}`, {
		//     headers: {
		//         'Content-Type': "application/json"
		//     }
		// });

		return {
			status: 'success',
			banner: banner.json(),
			newArrival: newArrivals.json(),
			trending: trendingProduct.json(),
			celebrity: celebrity.json()
			// recommended: recommended.json(),
			// flashSale: flashSale.json()
		};
	} catch (err) {
		return {
			status: 'error',
			message: err
		};
	}
};
