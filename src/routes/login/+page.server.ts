import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, sessions } from '$lib/server/db/schema';
import { verifyPassword } from '$lib/server/authUtils';
import { eq } from 'drizzle-orm';

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = form.get('email') as string;
		const password = form.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.' });
		}

		const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
		if (!user || !user.hashedPassword) {
			return fail(401, { error: 'Invalid credentials' });
		}

		const valid = await verifyPassword(password, user.hashedPassword);
		if (!valid) {
			return fail(401, { error: 'Invalid credentials' });
		}

		const sessionToken = crypto.randomUUID();
		const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
		await db.insert(sessions).values({
			sessionToken,
			userId: user.id,
			expires,
		});
		cookies.set('session', sessionToken, {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		});
		throw redirect(303, '/dashboard');
	}
};
