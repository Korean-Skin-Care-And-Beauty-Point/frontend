import { VITE_BACKEND_URL } from "$env/static/private";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, fetch }) => {
    try {
        const category = await fetch(`${VITE_BACKEND_URL}/category`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        return {
            locals,
            category: category.json()
        };
    } catch (err) {
        return {
            status: "error",
            message: err
        };
    }
};