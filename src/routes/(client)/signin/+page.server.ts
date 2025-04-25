import axios from "$lib/hooks/axios";
import type { Actions } from "./$types";
import { VITE_BACKEND_URL } from "$env/static/private";

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get("password");

        try {

            const response = await axios.post(`${VITE_BACKEND_URL}/auth/login`,
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },

                    withCredentials: true
                });

            cookies.set("accessToken", response?.data?.accessToken, {
                path: '/',
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 300,
            });
            cookies.set("refreshToken", response?.data?.refreshToken, {
                path: '/',
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 86400,
            });

            cookies.set("u", JSON.stringify(response?.data?.user), {
                path: '/',
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 86400,
            });

            return {
                status: "success",
                message: response?.data?.message
            };
        } catch (err) {
            return {
                status: "error",
                // @ts-expect-error is a empty object
                message: err?.response?.data?.message
            };
        }


    }
};