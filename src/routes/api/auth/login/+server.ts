import { json, error } from '@sveltejs/kit';
import { signIn } from '$lib/server/auth';

export async function POST({ request }) { // Destructure request directly
    const { email, password } = await request.json(); // Expect email

    try {
        await signIn('credentials', { email, password, redirectTo: '/dashboard' }); // Use email
        return json({ success: true });
    } catch (e) {
        console.error("API Login Error:", e);
        throw error(401, 'Invalid credentials');
    }
}