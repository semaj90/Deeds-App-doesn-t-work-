import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.session?.user) {
        throw redirect(302, '/dashboard');
    }
    return {};
};

export const actions: Actions = {
    default: async ({ request, url, locals: { auth } }) => {
        const form = await request.formData();
        const email = form.get('email')?.toString();
        const password = form.get('password')?.toString();

        if (!email || !password) {
            return fail(400, { error: 'Missing email or password' });
        }

        try {
            const result = await auth.signIn('credentials', {
                email,
                password,
                redirectTo: url.searchParams.get('from') || '/dashboard'
            });

            if (!result?.ok) {
                return fail(401, {
                    error: 'Invalid credentials'
                });
            }
        } catch (e) {
            console.error('Login error:', e);
            return fail(500, {
                error: 'Server error during login'
            });
        }
    }
};
