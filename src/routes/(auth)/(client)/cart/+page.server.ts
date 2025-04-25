import { VITE_BACKEND_URL } from "$env/static/private";
import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    try {
        const response = await fetch(`${VITE_BACKEND_URL}/protected/products/cart`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("accessToken")}`
            }
        });


        if (!response.ok) {
            error(401, "Unauthorized");
        }

        return {
            cart: response.json(),
            message: "Cart successfully fetched",
            status: "success"
        };

    } catch (err) {
        return {
            // @ts-expect-error as message is an empty object
            message: err.message,
            status: "error"
        };
    }
};


export const actions: Actions = {
    deleteProducts: async ({ request, fetch, cookies }) => {
        try {
            const formData = await request.formData();
            const productId = formData.getAll('productId[]').map((id) => Number(id));

            if (!Array.isArray(productId)) {
                return fail(400, { message: 'Invalid productIds format', status: 'error' });
            }

            await fetch(`${VITE_BACKEND_URL}/protected/products/cart/delete`, {
                body: JSON.stringify({ productId }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cookies.get("accessToken")}`
                }
            });


            return { message: 'Products deleted successfully', status: 'success' };
        } catch (error) {
            console.error('Error deleting products:', error);
            return fail(500, { message: 'Unable to delete products', status: 'error' });
        }
    },

    deleteAProduct: async ({ request, fetch, cookies }) => {
        try {

            const formData = await request.formData();
            const productId = formData.get("productId");

            await fetch(`${VITE_BACKEND_URL}/protected/products/cart/delete-a-item`, {
                body: JSON.stringify(productId),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cookies.get("accessToken")}`
                }
            });
            return { message: "Product deleted successfully", status: "success" };

        } catch (error) {
            console.error('Error deleting product:', error);
            return fail(500, { message: 'Unable to delete products', status: 'error' });
        }
    }
};