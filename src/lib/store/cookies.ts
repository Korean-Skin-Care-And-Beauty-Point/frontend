// src/lib/stores/cookies.ts
import { browser } from '$app/environment';

export const cookies = {
    get: (name: string) => {
        if (!browser) return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    },
    set: (name: string, value: string, options: any) => {
        if (!browser) return;
        let cookieString = `${name}=${value}; path=${options.path || '/'}`;
        if (options.expires) {
            cookieString += `; expires=${options.expires.toUTCString()}`;
        }
        if (options.maxAge) {
            cookieString += `; max-age=${options.maxAge}`;
        }
        if (options.domain) {
            cookieString += `; domain=${options.domain}`;
        }
        if (options.secure) {
            cookieString += '; secure';
        }
        if (options.sameSite) {
            cookieString += `; samesite=${options.sameSite}`;
        }
        if (options.httpOnly) {
            cookieString += '; httpOnly';
        }
        document.cookie = cookieString;
    },
    remove: (name: string, options: any) => {
        if (!browser) return;
        cookies.set(name, '', { ...options, maxAge: 0 });
    },
};