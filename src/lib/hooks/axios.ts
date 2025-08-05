import axios from 'axios';
import { VITE_BACKEND_URL } from '$env/static/private';
import { endpoints } from '$lib/utils/api';

const instance = axios.create({
	baseURL: VITE_BACKEND_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
});

instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshResponse = await axios.post(
					`${VITE_BACKEND_URL}${endpoints.auth.rotateToken}`,
					{},
					{
						withCredentials: true
					}
				);

				return instance(originalRequest);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (refreshError: any) {
				console.error('Token refresh failed:', refreshError);
				return Promise.reject({
					...refreshError,
					isRefreshError: true
				});
			}
		}

		return Promise.reject(error);
	}
);

export default instance;
