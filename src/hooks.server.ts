import { auth } from '$lib/server/auth';
import { redirect, error } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import type { Session } from '@auth/core/types';

// Only one handle export is allowed. Wrap auth.handle and add custom logic.
export const handle: Handle = async ({ event, resolve }) => {
    // Run Auth.js handle first
    const authResponse = await auth.handle({ event, resolve });
    if (authResponse instanceof Response) {
        return authResponse;
    }

    // Custom logic after Auth.js
    const session: Session | null = await event.locals.auth();
    // For backwards compatibility
    event.locals.session = session;

    const protectedPaths = ['/dashboard', '/criminals', '/cases', '/statutes', '/evidence'];
    const publicPaths = ['/', '/login', '/register', '/about', '/contact'];
    const isProtectedRoute = protectedPaths.some(path => event.url.pathname.startsWith(path));
    const isPublicRoute = publicPaths.some(path => event.url.pathname === path);

    if (isProtectedRoute && !session) {
        throw redirect(303, `/login?from=${encodeURIComponent(event.url.pathname)}`);
    }

    if (event.url.pathname.startsWith('/api/') && !session && !event.url.pathname.startsWith('/api/auth')) {
        throw error(401, 'Unauthorized');
    }

    const adminRoutes = ['/admin'];
    const isAdminRoute = adminRoutes.some(route => event.url.pathname.startsWith(route));
    if (isAdminRoute && session?.user?.role !== 'admin') {
        throw error(403, 'Forbidden');
    }

    return await resolve(event);
};
