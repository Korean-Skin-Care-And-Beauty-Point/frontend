import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    async default({ cookies }) {
        const accessToken = cookies.get('accessToken');
        const refreshToken = cookies.get('refreshToken');
        const userDetails = cookies.get('u');

        if (!accessToken || !refreshToken || !userDetails) {
            error(500, "Unable to logout");
        }

        cookies.delete("accessToken", {
            path: '/',
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 300,
        });
        cookies.delete("refreshToken", {
            path: '/',
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 86400,
        });

        cookies.delete("u", {
            path: '/',
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 86400,
        });
        return redirect(301, "/signin");
    }
};