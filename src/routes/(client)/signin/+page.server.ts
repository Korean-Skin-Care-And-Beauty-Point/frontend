import type { Actions } from './$types';
import { VITE_BACKEND_URL } from '$env/static/private';
import { endpoints } from '$lib/utils/api';

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		try {
			// const response = await axios.post(
			// 	`${VITE_BACKEND_URL}${endpoints.auth.login}`,
			// 	{ email, password },
			// 	{
			// 		headers: {
			// 			'Content-Type': 'application/json',
			// 			Accept: 'application/json'
			// 		},

			// 		withCredentials: true
			// 	}
			// );

			const response = await fetch(`${VITE_BACKEND_URL}${endpoints.auth.login}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			cookies.set('accessToken', data?.access_token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: false
			});

			cookies.set('u', JSON.stringify(data?.user), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: false
			});

			return {
				status: data?.status,
				message: data?.message
			};
		} catch (err) {
			console.log('Error', err);
			cookies.delete('accessToken', { path: '/' });
			cookies.delete('u', { path: '/' });
			// throw redirect(302, '/signin');
			return {
				status: 'error',
				// @ts-expect-error is a empty object
				message: err?.response?.data?.message
			};
		}
	}
};
