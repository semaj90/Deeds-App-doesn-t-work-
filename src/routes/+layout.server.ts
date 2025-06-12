import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// The `auth()` helper from Auth.js gets the session
	const session = await locals.auth();

	// Pass the user object to the `data` prop for all pages
	return {
		user: session?.user
	};
};