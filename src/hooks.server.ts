import { VITE_BACKEND_URL } from '$env/static/private';
import { endpoints } from '$lib/utils/api';
import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	let newRequest = request;

	const accessToken = event.cookies.get('accessToken');
	if (accessToken) {
		newRequest = new Request(request, {
			headers: {
				...request.headers,
				Authorization: `Bearer ${accessToken}`
			}
		});
	}

	let response = await fetch(newRequest);

	// Only attempt token refresh for 401 responses when we have an accessToken
	if (response.status === 401 && accessToken) {
		try {
			const refreshResponse = await fetch(`${VITE_BACKEND_URL}${endpoints.auth.rotateToken}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`
				}
			});

			if (refreshResponse.ok) {
				const { accessToken: newAccessToken } = await refreshResponse.json();
				event.cookies.set('accessToken', newAccessToken, {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
					secure: false,
					maxAge: 300
				});

				newRequest = new Request(request, {
					headers: {
						...request.headers,
						Authorization: `Bearer ${newAccessToken}`
					}
				});
				response = await fetch(newRequest);
			} else {
				console.error('Refresh token failed:', await refreshResponse.text());
				event.cookies.delete('accessToken', { path: '/' });
				event.cookies.delete('u', { path: '/' });
			}
		} catch (error) {
			console.error('Token refresh error:', error);
			event.cookies.delete('accessToken', { path: '/' });
			event.cookies.delete('u', { path: '/' });
		}
	}

	return response;
};

export const handle: Handle = async ({ event, resolve }) => {
	const accessToken = event.cookies.get('accessToken');
	const userCookie = event.cookies.get('u');

	// Initialize authentication state
	event.locals.authenticated = false;
	event.locals.user = null;

	const refreshTokens = async () => {
		if (!accessToken) return null;

		const response = await fetch(`${VITE_BACKEND_URL}${endpoints.auth.rotateToken}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			}
		});

		if (!response.ok) {
			throw new Error('Failed to refresh tokens');
		}

		const { accessToken: newAccessToken, user } = await response.json();

		event.cookies.set('accessToken', newAccessToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false
		});

		if (user) {
			event.cookies.set('u', JSON.stringify(user), {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: false
			});
			return user;
		}

		return null;
	};

	try {
		if (accessToken) {
			// Check token expiration
			const decodedToken: { exp: number } = jwtDecode(accessToken);
			const currentTime = Date.now() / 1000;

			// Refresh token if it's about to expire (within 2 minutes)
			if (decodedToken.exp - currentTime < 120) {
				const user = await refreshTokens();
				if (user) {
					event.locals.user = user;
				}
			}

			// Set user from cookie if available
			if (userCookie) {
				try {
					event.locals.user = JSON.parse(userCookie);
				} catch (error) {
					console.error('Invalid user cookie:', error);
					event.cookies.delete('u', { path: '/' });
				}
			}

			event.locals.authenticated = true;
		}
	} catch (error) {
		console.error('Authentication error:', error);
		event.cookies.delete('accessToken', { path: '/' });
		event.cookies.delete('u', { path: '/' });
	}

	// Handle route protection
	const routeId = event.route.id;

	// Only check authentication for routes under /(auth)
	if (routeId?.startsWith('/(auth)')) {
		if (!event.locals.authenticated) {
			throw redirect(302, '/signin');
		}
	}

	// Redirect authenticated users away from auth pages
	if (
		event.locals.authenticated &&
		(event.url.pathname === '/signin' || event.url.pathname === '/register')
	) {
		throw redirect(303, '/');
	}

	const response = await resolve(event);

	if (routeId?.startsWith('/(auth)')) {
		response.headers.set('X-Auth-Check', 'required');
	}

	return response;
};
