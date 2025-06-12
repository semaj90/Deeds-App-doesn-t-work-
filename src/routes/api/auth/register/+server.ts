import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userTable } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/authUtils'; // Updated import
import { DrizzleError } from 'drizzle-orm';

export async function POST({ request }) {
    const { email, password } = await request.json();

    if (!email || !password) {
        throw error(400, 'Email and password are required.');
    }

    const hashedPassword = await hashPassword(password);

    try {
        await db.insert(userTable).values({
            id: crypto.randomUUID(),
            username: email.split('@')[0], // Simple username from email
            email,
            hashedPassword,
            role: 'user' // Default role for new registrations
        });
        return json({ success: true, message: 'Registration successful!' });
    } catch (e) {
        if (e instanceof DrizzleError && e.message.includes('UNIQUE constraint failed')) {
            throw error(409, 'A user with this email already exists.');
        }
        console.error("API Register Error:", e);
        throw error(500, 'An unexpected error occurred during registration.');
    }
}