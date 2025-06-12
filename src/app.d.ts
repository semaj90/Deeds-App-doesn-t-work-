import type { DefaultSession } from '@auth/core/types';
import type { SvelteKitAuth } from "@auth/sveltekit"; // Import SvelteKitAuth type

declare module '@auth/core/types' {
	interface Session {
		user?: {
			id?: string;
			username?: string;
			role?: string; // Add role here
		} & DefaultSession['user'];
	}

	interface User {
		username?: string;
		role: string; // Change to required string to match Drizzle schema
	}
}

import type { User } from '$lib/server/db/schema'; // Keep your existing User import

declare global {
	namespace App {
		interface Locals {
			user: User | null;
			session: import('@auth/core/types').Session | null; // Use Session from @auth/core/types
			auth: ReturnType<typeof SvelteKitAuth>["auth"];
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
