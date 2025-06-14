import { Auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
  // Use Auth.handle, NOT handleAuth
  const response = await Auth.handle({ event, resolve });

  // Optional: protect /admin routes
  const url = event.url.pathname;
  if (url.startsWith('/admin') && !event.locals.session) {
    throw redirect(302, '/login');
  }

  return response;
};
