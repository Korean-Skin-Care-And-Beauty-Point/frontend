import { VITE_BACKEND_URL } from "$env/static/private";
import { endpoints } from "$lib/utils/api";
import { error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    try {
        const body = await fetch(`${VITE_BACKEND_URL}${endpoints.profile.wishlist}`, {
            headers: {
                "Authorization": `Bearer ${cookies.get("accessToken")}`,
                "Content-Type": "application/json"
            },
        });


        if (!body.ok) {
            error(401, "Unauthorized");
        }

        return {
            wishlist: body.json(),
            message: "Wishlist retrieved successfully",
            status: "success"
        };
    } catch (err) {
        return {
            // @ts-expect-error err is an empty object
            message: err.message,
            status: "error"
        };
    }
};

export const actions: Actions = {
    default: async ({ fetch, cookies, request }) => {
        const data = await request.formData();
        const wishlistId = data.get("wishlistId");

        try {

            const response = await fetch(`${VITE_BACKEND_URL}${endpoints.profile.wishlistDelete}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cookies.get("accessToken")}`
                },
                body: wishlistId
            });

            return {
                status: "success",
                message: await response.json()
            };
        } catch (err) {
            return {
                status: "error",
                // @ts-expect-error err is an empty object
                message: err.message
            };
        }


    }
};