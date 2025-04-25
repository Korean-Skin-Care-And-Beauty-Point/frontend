import type { Actions } from "./$types";
import { VITE_BACKEND_URL } from "$env/static/private";

export const actions: Actions = {
    default: async ({ request, cookies, fetch }) => {
        const formData = await request.formData();
        const fullName = formData.get("fullName");
        const email = formData.get('email');
        const phoneNumber = formData.get("phoneNumber");
        const password = formData.get("password");
        const userType = formData.get('userType') || "CUSTOMER";
        const gender = formData.get("gender")?.toString().toUpperCase();
        const address = formData.get("address");
        const province = formData.get("province");
        // const district = formData.get("district");
        const zipCode = formData.get("zipCode");

        try {

            const response = await fetch(`${VITE_BACKEND_URL}/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ fullName, email, phoneNumber, password, userType, gender, address, province, zipCode })
                });

            const data = await response?.json();

            cookies.set("accessToken", data?.accessToken, {
                path: "/",
                httpOnly: true,
                maxAge: 3600,
                sameSite: "lax",
            });
            cookies.set("refreshToken", data?.refreshToken, {
                path: "/",
                httpOnly: true,
                maxAge: 3600,
                sameSite: "lax",
            });

            cookies.set("u", JSON.stringify(data?.user), {
                path: "/",
                httpOnly: true,
                maxAge: 3600,
                sameSite: "lax",
            });

            return {
                status: "success",
                message: data?.message
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