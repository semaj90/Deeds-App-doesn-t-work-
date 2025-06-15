import { verifyToken } from '$lib/server/auth';
import { redirect, error } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

// Only one handle export is allowed. Wrap auth.handle and add custom logic.
export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('token');
    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            event.locals.user = decoded;
        }
    }

    const protectedPaths = ['/dashboard', '/criminals', '/cases', '/statutes', '/evidence'];
    const publicPaths = ['/', '/login', '/register', '/about', '/contact'];
    const isProtectedRoute = protectedPaths.some(path => event.url.pathname.startsWith(path));
    const isPublicRoute = publicPaths.some(path => event.url.pathname === path);

    if (isProtectedRoute && !event.locals.user) {
        throw redirect(303, `/login?from=${encodeURIComponent(event.url.pathname)}`);
    }

    if (event.url.pathname.startsWith('/api/') && !event.locals.user && !event.url.pathname.startsWith('/api/auth')) {
        throw error(401, 'Unauthorized');
    }

    const adminRoutes = ['/admin'];
    const isAdminRoute = adminRoutes.some(route => event.url.pathname.startsWith(route));
    if (isAdminRoute && event.locals.user?.role !== 'admin') {
        throw error(403, 'Forbidden');
    }

    return await resolve(event);
};
