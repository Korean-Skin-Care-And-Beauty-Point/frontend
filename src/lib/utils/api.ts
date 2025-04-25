
export const endpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        rotateToken: "/auth/rotate-token",
    },
    profile: {
        user: "/protected/user",
        updateProfile: "/protected/user/edit",
        wishlist: "/protected/products/wishlist",
        wishlistDelete: "/protected/products/wishlist/delete"

    },
    category: {
        banner: "/category/banner"
    },
    product: {
        newArrival: "/products/new-arrivals",
        trending: "/products/trending-now",
        celebrity: "/products/celebrity",
        recommended: "/products/recommended",
        flashSale: "/products/flash-sales"
    }
};