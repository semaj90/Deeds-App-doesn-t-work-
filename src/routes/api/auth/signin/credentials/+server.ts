import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function findUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  console.log('findUserByEmail result:', user ? { id: user.id, email: user.email, hashedPasswordExists: !!user.hashedPassword } : 'User not found');
  return user;
}

async function validatePassword(user: typeof users.$inferSelect | undefined, password: string) {
  if (!user || !user.hashedPassword) {
    console.log('validatePassword: User or hashedPassword missing.');
    return false;
  }
  console.log('validatePassword: Comparing password for user:', user.email);
  return await bcrypt.compare(password, user.hashedPassword);
}

export const POST = async ({ request, cookies }) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    console.log('POST: Missing email or password.');
    return json({ error: 'Missing credentials' }, { status: 400 });
  }

  const user = await findUserByEmail(email as string);
  const isValid = await validatePassword(user, password as string);

  if (!user || !isValid) {
    console.log('POST: Invalid credentials for user:', email);
    return json({ error: 'Invalid credentials' }, { status: 401 });
  }

  cookies.set('session', user.id, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  console.log('POST: User authenticated successfully:', user.email);
  return json({ success: true, userId: user.id });
};