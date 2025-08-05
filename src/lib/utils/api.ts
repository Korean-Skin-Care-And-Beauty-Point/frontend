export const endpoints = {
	auth: {
		login: '/auth/login',
		register: '/auth/register',
		rotateToken: '/auth/refresh',
		googleCallback: '/auth/google/redirect'
	},
	profile: {
		user: '/profile/me',
		updateProfile: '/profile/me/edit',
		wishlist: '/protected/products/wishlist',
		wishlistDelete: '/protected/products/wishlist/delete'
	},
	category: {
		categories: '/category/',
		banner: '/category/banners',
		search: (search: string) => `/category/search?${search}`
	},
	cart: {
		getCart: '/cart/',
		storeCart: '/cart/create',
		deleteAproduct: (id: string) => `/cart/delete/${id}`,
		deleteAllProduct: '/cart/delete'
	},
	product: {
		individualProduct: (id: string) => `/product/${id}`,
		newArrival: '/product/newarrival',
		trending: '/product/trending',
		celebrity: '/products/celebrity',
		recommended: '/products/recommended',
		flashSale: '/products/flash-sales'
	}
};
