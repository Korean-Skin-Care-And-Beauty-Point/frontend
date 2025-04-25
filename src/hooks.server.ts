import { VITE_BACKEND_URL } from "$env/static/private";
import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";
import { jwtDecode } from "jwt-decode";


export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
    let newRequest = request;

    const accessToken = event.cookies.get("accessToken");
    if (accessToken) {
        newRequest = new Request(request, {
            headers: {
                ...request.headers,
                Authorization: `Bearer ${accessToken}`,
            }
        });
    }

    let response = await fetch(newRequest);
    if (response.status === 401) {
        const refreshToken = event.cookies.get("refreshToken");

        if (refreshToken) {
            try {
                const refreshResponse = await fetch(`${VITE_BACKEND_URL}/auth/rotate-token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${refreshToken}`
                    },
                });

                console.log("refreshResponse:", refreshResponse);

                if (refreshResponse.ok) {
                    const { accessToken: newAccessToken } = await refreshResponse.json();
                    event.cookies.set("accessToken", newAccessToken, {
                        path: '/',
                        httpOnly: true,
                        sameSite: "lax",
                        secure: false,
                        maxAge: 300,
                    });

                    newRequest = new Request(request, {
                        headers: {
                            ...request.headers,
                            Authorization: `Bearer ${newAccessToken}`
                        }
                    });
                    response = await fetch(newRequest);
                } else {
                    console.error("Refresh token failed:", refreshResponse.status, await refreshResponse.text());
                    event.cookies.delete("accessToken", {
                        path: '/',
                        httpOnly: true,
                        sameSite: "lax",
                        secure: false,
                        maxAge: 300,
                    });
                    throw new Error("Refresh token failed");
                }
            }
            catch (error) {
                console.error("Token refresh error:", error);
                event.cookies.delete("accessToken", {
                    path: '/',
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    maxAge: 300,
                });
                throw new Error("Token refresh failed");
            }
        } else {
            event.cookies.delete("accessToken", {
                path: '/',
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 300,
            });
            throw new Error("No refresh Token");
        }
    }
    return response;
};


export const handle: Handle = async ({ event, resolve }) => {
    let user = null;
    const accessToken = event.cookies.get("accessToken");
    const refreshToken = event.cookies.get("refreshToken");
    event.locals.authenticated = false;

    const userCookie = event.cookies.get('u') as string;

    const refreshTokens = async () => {
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await fetch(`${VITE_BACKEND_URL}/auth/rotate-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            },
        });

        if (!response.ok) {
            throw new Error("Failed to refresh tokens");
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = await response.json();

        event.cookies.set("accessToken", newAccessToken, {
            path: '/',
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 300,
        });

        if (user) {
            event.cookies.set("u", JSON.stringify(user), {
                path: '/',
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 86400,
            });
        }

        if (newRefreshToken) {
            event.cookies.set("refreshToken", newRefreshToken, {
                path: '/',
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 86400,
            });
        }

        return newAccessToken;
    };

    try {
        if (!accessToken && refreshToken) {
            await refreshTokens();
            event.locals.authenticated = true;
            if (userCookie) {
                try {
                    user = JSON.parse(userCookie);
                    event.locals.user = user;
                } catch (error) {
                    console.error('Invalid user cookie:', error);
                    event.cookies.delete('u', {
                        path: '/',
                        httpOnly: true,
                        sameSite: "strict",
                        secure: false
                    });
                }
            }
        }
        else if (accessToken) {
            const decodedToken: { exp: number; } = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp - currentTime < 120) {
                await refreshTokens();
            }

            if (userCookie) {
                try {
                    user = JSON.parse(userCookie);
                    event.locals.user = user;
                    event.locals.authenticated = true;
                } catch (error) {
                    console.error('Invalid user cookie:', error);
                    event.cookies.delete('u', {
                        path: '/',
                        httpOnly: true,
                        sameSite: "strict",
                        secure: false
                    });
                }
            } else {
                event.locals.authenticated = true;
            }
        }

    } catch (error) {
        console.error('Invalid user cookie or token:', error);
        event.cookies.delete('u', {
            path: '/',
            httpOnly: true,
            sameSite: "strict",
            secure: false
        });
        event.cookies.delete('accessToken', {
            path: '/',
            httpOnly: true,
            sameSite: "strict",
            secure: false
        });
        event.cookies.delete('refreshToken', {
            path: '/',
            httpOnly: true,
            sameSite: "strict",
            secure: false
        });

        if (event.url.pathname !== '/signin') {
            throw redirect(302, '/signin');
        }
        return await resolve(event);
    }

    if (event.locals.authenticated && (event.url.pathname === '/signin' || event.url.pathname === '/register')) {
        throw redirect(303, '/');
    }

    const routeId = event.route.id;
    if (routeId?.startsWith("/(auth)")) {
        if (!event.locals.authenticated) {
            if (event.url.pathname !== '/signin') {
                throw redirect(302, '/signin');
            }
        }
    }

    const response = await resolve(event);

    // if (response.status === 401) {
    //     throw error(401, 'Unauthorized access');
    // }

    if (routeId?.startsWith("/(auth)")) {
        response.headers.set('X-Auth-Check', 'required');
    }

    return response;
};

// export const handle: Handle = async ({ event, resolve }) => {
//     let user = null;
//     const accessToken = event.cookies.get("accessToken");
//     event.locals.authenticated = false;

//     const userCookie = event.cookies.get('u') as string;

//     if (accessToken) {
//         try {
//             user = JSON.parse(userCookie);
//             event.locals.user = user;
//             event.locals.authenticated = true;
//         } catch (error) {
//             console.error('Invalid user cookie:', error);
//             event.cookies.delete('u', {
//                 path: '/',
//                 httpOnly: true,
//                 sameSite: "strict",
//                 secure: false
//             });
//         }
//     }

//     if (accessToken && (event.url.pathname === '/signin' || event.url.pathname === '/register')) {
//         throw redirect(303, '/');
//     }

//     const routeId = event.route.id;
//     if (routeId?.startsWith("/(auth)")) {
//         if (!event.locals.authenticated) {
//             throw redirect(302, '/signin');
//         }
//     }

//     const response = await resolve(event);

//     if (routeId?.startsWith("/(auth)")) {
//         response.headers.set('X-Auth-Check', 'required');
//     }

//     return response;
// };