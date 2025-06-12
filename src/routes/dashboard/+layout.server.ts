import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.session?.user) { // Check for user within the session object populated by Auth.js
    throw redirect(302, '/login');
  }
};