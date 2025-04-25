import { VITE_BACKEND_BASE_URL } from "$env/static/private";
import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
    baseURL: `${VITE_BACKEND_BASE_URL}`
});