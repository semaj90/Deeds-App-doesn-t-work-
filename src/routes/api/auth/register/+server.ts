import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { hashPassword } from '$lib/server/authUtils';
import { DrizzleError } from 'drizzle-orm';

export async function POST({ request }) {
    const { name, email, password } = await request.json();
    console.log('[Register API] Received data:', { name, email, password: '***' });

    if (!email || !password || !name) {
        console.warn('[Register API] Missing name, email, or password');
        throw error(400, 'Name, email, and password are required.');
    }

    const hashedPassword = await hashPassword(password);
    console.log('[Register API] Hashed password generated.');

    try {
        const newUser = {
            id: crypto.randomUUID(), // This will be a string UUID
            username: email.split('@')[0],
            name,
            email,
            hashedPassword, // This should match the schema's column name
            role: 'user',
            profile: {} // Default empty object
        };
        console.log('[Register API] Attempting to insert user:', newUser);
        await db.insert(users).values(newUser);
        return json({ success: true, message: 'Registration successful!' });
    } catch (e) {
        if (e instanceof DrizzleError && e.message.includes('UNIQUE constraint failed')) {
            throw error(409, 'A user with this email already exists.');
        }
        console.error("API Register Error:", e);
        throw error(500, 'An unexpected error occurred during registration.');
    }
}