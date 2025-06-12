import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import { userTable } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import { DrizzleError } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.session) {
		throw redirect(302, "/");
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.' });
		}

		const hashedPassword = await hashPassword(password);

		try {
			await db.insert(userTable).values({
				email,
				hashedPassword,
                id: crypto.randomUUID(),
                username: email.split('@')[0]
			});
		} catch (e) {
			if (e instanceof DrizzleError && e.message.includes('UNIQUE constraint failed')) {
				return fail(409, { error: 'A user with this email already exists.' });
			}
			console.error(e);
			return fail(500, { error: 'An unexpected error occurred.' });
		}

		throw redirect(303, '/login');
	}
};