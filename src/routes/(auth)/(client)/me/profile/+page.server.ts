import { VITE_BACKEND_URL } from '$env/static/private';
import { endpoints } from '$lib/utils/api';
import type { Actions, PageServerLoad } from './$types';
// import { formData } from '$lib/store/formData.svelte.js';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    try {
        const profile = await fetch(`${VITE_BACKEND_URL}${endpoints.profile.user}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("accessToken")}`
            }
        });


        if (!profile.ok) {
            error(401, { message: 'Unauthorized' });
        }


        return {
            status: "success",
            profile: profile.json()
        };
    } catch (err) {
        return {
            // @ts-expect-error error is empty object
            message: err.message,
            status: "error"
        };
    }
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const fullName = data.get("fullName") as string;
        const email = data.get("email") as string;
        const phoneNumber = data.get("phoneNumber") as string;
        const description = data.get("description") as string;
        const dob = data.get("dob") as string;
        const gender = data.get("gender") as string;
        const address = data.get('address') as string;
        const profileImage = data.get("profileImage") as File;

        if (!fullName || !email) {
            return fail(400, { error: true, message: 'Full name and email are required' });
        }

        // Prepare the body (handling both file and regular data)
        const body = new FormData();
        body.append('fullName', fullName.toString());
        body.append('email', email.toString());
        body.append("description", description.toString());
        if (phoneNumber) body.append('phoneNumber', phoneNumber.toString());
        if (dob) body.append('dob', dob.toString());
        if (gender) body.append('gender', gender.toString());
        if (address) body.append('address', address.toString());
        if (profileImage.size > 0) body.append('profileImage', profileImage);


        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);
        formData.append("description", description);
        formData.append("dob", dob);
        formData.append("gender", gender);
        formData.append("address", address);
        formData.append("profileImage", profileImage);

        try {
            const response = await fetch(`${VITE_BACKEND_URL}${endpoints.profile.updateProfile}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: body
            });

            if (!response.ok) {
                const error = await response.json();
                return fail(response.status, { error: true, message: error.message });
            }

            const data = await response.json();

            cookies.set("u", JSON.stringify(data.profile), {
                path: '/',
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 86400,
            });


            return { status: "success", message: 'Profile updated successfully' };
        } catch (err) {
            return fail(500, { status: "error", message: 'Failed to update profile' });
        }

    }
};
