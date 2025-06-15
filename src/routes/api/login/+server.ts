import { lucia } from '../../lib/server/lucia';
import { db } from '../../lib/server/db';
import { users } from '../../lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const POST = async ({ request, cookies }) => {
  const { email, password } = await request.json();
  const user = await db.query.users.findFirst({ where: (u) => u.email === email });
  if (!user || !user.password_hash) throw error(401, 'Invalid credentials');
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw error(401, 'Invalid credentials');
  const session = await lucia.createSession(user.id, {});
  lucia.createSessionCookie(session, cookies);
  return json({ success: true });
};
