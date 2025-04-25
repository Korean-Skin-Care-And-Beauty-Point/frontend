import axios from 'axios';
import { VITE_BACKEND_URL } from '$env/static/private';
import { goto } from '$app/navigation';
import { cookies } from '$lib/store/cookies';

const instance = axios.create({
    baseURL: VITE_BACKEND_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get refresh token from cookie
                const refreshToken = cookies.get('refreshToken');

                console.log(refreshToken);

                if (!refreshToken) {
                    goto('/signin');
                    return Promise.reject(error);
                }

                const refreshResponse = await axios.post(`${VITE_BACKEND_URL}/api/auth/refresh-token`, {
                    refreshToken: refreshToken,
                });

                // Since accessToken is http only, nothing to do on the front end.
                return instance(originalRequest);
            } catch (refreshError) {
                // Refresh token expired or invalid
                cookies.remove('accessToken', { path: '/' });
                cookies.remove('refreshToken', { path: '/' });
                cookies.remove('u', { path: '/' });
                goto('/signin');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;