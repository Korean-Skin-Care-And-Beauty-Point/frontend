import { VITE_BACKEND_URL } from "$env/static/private";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ fetch, params, url }) => {
    const categoryId = params.categoryType === "search" ? "" : params.categoryType;
    const searchQuery = url.searchParams.get("search") || "*";

    const knownParams = ['search', 'categories', 'sort_by', 'page', 'per_page'];

    const backendParams = new URLSearchParams();
    backendParams.set('search', searchQuery);

    if (categoryId) {
        backendParams.set('categories', categoryId);
    }

    url.searchParams.forEach((value, key) => {
        if (!knownParams.includes(key)) {
            if (value.includes(',')) {
                value.split(',').forEach(v => backendParams.append(key, v));
            } else {
                backendParams.append(key, value);
            }
        }
    });

    const page = url.searchParams.get('page');
    const perPage = url.searchParams.get('per_page');
    if (page) backendParams.set('page', page);
    if (perPage) backendParams.set('per_page', perPage);

    try {
        const productCategory = await fetch(`${VITE_BACKEND_URL}/products/search?${backendParams.toString()}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        return {
            status: "success",
            productCategory: productCategory.json()
        };

    } catch (err) {
        return {
            status: "error",
            message: "Unable to fetch products",
            error: err
        };
    }
};
