import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { hashPassword, signToken } from '$lib/server/auth';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  const { email, password } = await request.json();
  const passwordHash = await hashPassword(password);
  const id = crypto.randomUUID();

  const [newUser] = await db.insert(users).values({ id, email, hashedPassword: passwordHash }).returning();
  const token = signToken({ userId: newUser.id });

  cookies.set('token', token, { httpOnly: true, path: '/' });
  return json({ success: true });
}
