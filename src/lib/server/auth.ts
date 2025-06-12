import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/server/db';
import { users, accounts, sessions, verificationTokens } from '$lib/server/db/schema';
import Credentials from '@auth/sveltekit/providers/credentials';
import { verifyPassword } from '$lib/server/authUtils'; // Import from the new utils file
import { env } from '$env/dynamic/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
	// Use the Drizzle adapter to connect Auth.js to your database
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
		verificationTokensTable: verificationTokens
	}),

	// Configure the authentication providers
	providers: [
		Credentials({
			authorize: async (credentials) => {
				if (!credentials.email || !credentials.password) {
					return null;
				}

				const email = credentials.email as string;
				const password = credentials.password as string;

				// Find the user in the database
				const user = await db.query.users.findFirst({
					where: (users, { eq }) => eq(users.email, email)
				});

				// If no user is found, or the user has no password (e.g., signed up with Google)
				if (!user || !user.password) {
					return null;
				}

				// Verify the provided password against the stored hash
				const passwordIsValid = await verifyPassword(password, user.password);

				if (!passwordIsValid) {
					return null;
				}

				// If successful, return the user object
				return user;
			}
		})
		// You can add more providers here in the future
	],

	// Use database sessions for persistence
	session: {
		strategy: 'database'
	},

	// Define callbacks to customize session data
	callbacks: {
		async session({ session, user }) {
			// Add custom properties like `id` and `role` to the session object
			if (session.user) {
				session.user.id = user.id;
				// This assumes your 'users' table has a 'role' column.
				// Make sure to cast user to your specific type if needed.
				session.user.role = (user as any).role;
			}
			return session;
		}
	},

	// Set the custom login page
	pages: {
		signIn: '/login'
	},

	// Add the secret
	secret: env.AUTH_SECRET
});