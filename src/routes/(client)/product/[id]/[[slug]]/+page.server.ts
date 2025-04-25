import { VITE_BACKEND_URL } from "$env/static/private";
import { endpoints } from "$lib/utils/api";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ fetch, params }) => {
    try {
        const productId = params.id;

        const product = await fetch(`${VITE_BACKEND_URL}/products/product/${productId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        return {
            status: "success",
            product: product.json()
        };
    } catch (err) {
        return {
            status: "error",
            message: err
        };
    }
};


export const actions: Actions = {
    cart: async ({ request, params, fetch, cookies }) => {
        try {
            const formData = await request.formData();
            const productId = params.id;
            const attributes = JSON.parse(formData.get('attributes') as string);

            const arrayAttributes = Object.keys(attributes).map(title => ({ title, value: attributes[title] }));

            const response = await fetch(`${VITE_BACKEND_URL}/protected/products/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({ productId, attributes: arrayAttributes })
            });

            console.log(await response.json());

            return {
                CartStatus: "success",
                CartMessage: await response.json()
            };

        } catch (err) {
            return {
                CartMessage: err.message,
                CartStatus: "error"
            };
        }
    },

    wishlist: async ({ request, params, fetch, cookies }) => {
        try {
            const formData = await request.formData();
            const productId = params.id;
            const attributes = JSON.parse(formData.get('attributes') as string);

            const arrayAttributes = Object.keys(attributes).map(title => ({ title, value: attributes[title] }));

            const response = await fetch(`${VITE_BACKEND_URL}${endpoints.profile.wishlist}`, {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({ productId, attributes: arrayAttributes })
            });

            return {
                status: "success",
                message: await response.json()
            };

        } catch (err) {
            return {
                message: err,
                status: "error"
            };
        }
    }
};