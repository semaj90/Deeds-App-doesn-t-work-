import { lucia } from '../../../lib/server/lucia';
import { db } from '../../../lib/server/db';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies, locals }) => {
  // Assume Auth.js has set a temp cookie with user id
  const userId = cookies.get('authjs_user_id');
  if (!userId) throw redirect(302, '/login');
  // Create Lucia session
  const session = await lucia.createSession(userId, {});
  lucia.createSessionCookie(session, cookies);
  // Remove temp cookie
  cookies.delete('authjs_user_id');
  throw redirect(302, '/dashboard');
};
