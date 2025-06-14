import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { SvelteKitAuth } from '@auth/sveltekit';
import { db } from './db';
import Credentials from '@auth/core/providers/credentials';
import { compare } from 'bcrypt';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export const auth = SvelteKitAuth({
    adapter: DrizzleAdapter(db),
    debug: true,
    session: {
        strategy: 'jwt'
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };

                const user = await db.query.users.findFirst({
                    where: eq(users.email, email)
                });

                if (!user || !user.hashedPassword) return null;

                const isValid = await compare(password, user.hashedPassword);
                if (!isValid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    }
});