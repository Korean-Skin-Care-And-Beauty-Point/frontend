// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Env {
			VITE_BACKEND_URL: string;
			VITE_BACKEND_BASE_URL: string;
		}
		// interface Error {}
		interface Locals {
			authenticated: boolean;
			user: {
				name: string,
				role: string,
				avatar: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
