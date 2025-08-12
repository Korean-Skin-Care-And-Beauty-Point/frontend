import type { Actions } from './$types';
import { VITE_BACKEND_URL } from '$env/static/private';
import { endpoints } from '$lib/utils/api';

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		// const fullName = formData.get('fullName');
		// const email = formData.get('email');
		// const phoneNumber = formData.get('phoneNumber');
		// const password = formData.get('password');
		// const userType = formData.get('userType') || 'CUSTOMER';
		// const gender = formData.get('gender')?.toString().toUpperCase();
		// const address = formData.get('address');
		// const province = formData.get('province');
		// // const district = formData.get("district");
		// const zipCode = formData.get('zipCode');

		try {
			const response = await fetch(`${VITE_BACKEND_URL}${endpoints.auth.register}`, {
				method: 'POST',
				headers: {
					Accept: 'application/json'
				},
				body: formData
			});
			const data = await response?.json();

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
			console.log(err);
			return {
				status: 'error',
				// @ts-expect-error is a empty object
				message: err?.response?.data?.message
			};
		}
	}
};
