import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/server/db';
import { users, accounts, sessions, verificationTokens } from '$lib/server/db/schema';
import Credentials from '@auth/sveltekit/providers/credentials';
import { verifyPassword } from '$lib/server/authUtils';
import { env } from '$env/dynamic/private';
import type { DefaultSession, User as AuthUserBase } from '@auth/core/types'; // Renamed User to AuthUserBase to avoid conflict

if (!env.AUTH_SECRET) {
	throw new Error('Missing AUTH_SECRET environment variable. Please set AUTH_SECRET in your environment.');
}


export const load = async (event) => {
  const session = await event.locals.getSession?.();
  return { user: session?.user ?? null };
};

// Extend the session user type to include id and role
declare module '@auth/core/types' {
	interface Session {
		user: {
			id: string;
			role: string;
		} & DefaultSession['user'];
	}

	// Augment the existing User interface to add role and ensure required properties
	interface User {
		id: string; // Ensure 'id' is always present as it's required by Auth.js
		role: string; // Ensure 'role' is always present
		name?: string | null;
		email?: string | null;
		image?: string | null;
	}
}

// Define AppUser as a type alias for the augmented User interface
type AppUser = User;

const Auth = SvelteKitAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens
	}),
	providers: [
		Credentials({
			authorize: async (credentials) => {
				try {
					console.log('[Auth Debug] Credentials received:', credentials);

					if (!credentials?.email || !credentials?.password) {
						console.warn('[Auth Debug] Missing email or password');
						return null;
					}

					const email = credentials.email;
					const password = credentials.password;

					console.log('[Auth Debug] Attempting to find user with email:', email);
					const user = await db.query.users.findFirst({
						where: (users, { eq }) => eq(users.email, email)
					});
					console.log('[Auth Debug] User found by email query:', user);

					console.log('[Auth Debug] Found user:', user?.email ?? 'None');

					if (!user || !user.hashedPassword) {
						console.warn('[Auth Debug] User not found or password not set for user:', user?.email);
						return null;
					}

					console.log('[Auth Debug] User object before verifyPassword:', user);
					console.log('[Auth Debug] Hashed password from user:', user?.hashedPassword);
					// Ensure hashedPassword is a string before passing to verifyPassword
					const hashedPassword = user.hashedPassword;
					if (typeof hashedPassword !== 'string') {
						console.warn('[Auth Debug] Hashed password is not a string.');
						return null;
					}
					const isValid = await verifyPassword(password, hashedPassword);
					console.log('[Auth Debug] Password valid:', isValid);

					if (!isValid) return null;

					return {
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role
					} as AppUser;
				} catch (err) {
					console.error('[Auth Debug] authorize() error:', err);
					return null;
				}
			}
		})
	],
	session: {
		strategy: 'jwt'
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				const appUser = user as AppUser;
				token.id = appUser.id;
				token.role = appUser.role;
			}
			console.log('[Auth Debug] JWT Callback - token:', token);
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
			}
			console.log('[Auth Debug] Session Callback - session:', session);
			return session;
		}
	},
	pages: {
		signIn: '/login'
	},
	secret: env.AUTH_SECRET
});

export { Auth };