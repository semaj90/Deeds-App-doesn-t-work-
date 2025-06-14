import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async (event) => { // Receive the full event object
		const form = await event.request.formData(); // Access request from event
		const name = form.get('name') as string;
		const email = form.get('email') as string;
		const password = form.get('password') as string;

		const response = await event.fetch('/api/auth/register', { // Use event.fetch
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name, email, password })
		});

		if (response.ok) {
			throw redirect(303, '/login');
		} else {
			const result = await response.json();
			return fail(response.status, { error: result.message || 'Registration failed' });
		}
	}
};