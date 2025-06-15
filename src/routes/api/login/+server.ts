import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { comparePasswords, signToken } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

export async function POST({ request, cookies }) {
  const { email, password } = await request.json();
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user || !(await comparePasswords(password, user.hashedPassword ?? ''))) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const token = signToken({ userId: user.id });
  cookies.set('token', token, { httpOnly: true, path: '/' });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
