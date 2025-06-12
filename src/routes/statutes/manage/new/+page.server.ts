import { redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
    default: async ({ request, locals, fetch }) => {
        const { user } = await locals.auth.validateSession();
        if (!user) {
            throw redirect(302, '/login');
        }

        const data = await request.formData();
        const name = data.get('name')?.toString();
        const description = data.get('description')?.toString();
        const sectionNumber = data.get('sectionNumber')?.toString();

        if (!name || !sectionNumber) {
            return {
                status: 400,
                body: {
                    message: 'Name and section number are required'
                }
            };
        }

        const response = await fetch('/api/statutes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, sectionNumber })
        });

        if (response.ok) {
            throw redirect(303, '/statutes/manage');
        } else {
            const errorData = await response.json();
            return {
                status: response.status,
                body: {
                    message: errorData.message || 'Failed to add statute'
                }
            };
        }
    }
};