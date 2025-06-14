import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { cases } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/cases - List all cases, with optional search
export async function GET({ url }) {
    try {
        const search = url.searchParams.get('search')?.toLowerCase() || '';
        let query = db.select().from(cases);
        if (search) {
            query = query.where(
                (row) => row.title.toLowerCase().includes(search) || row.description.toLowerCase().includes(search)
            );
        }
        const allCases = await query;
        return json(allCases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        return json({ error: 'Failed to fetch cases', details: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}

// POST /api/cases - Create a new case
export async function POST({ request, locals }) {
    const { title, description, dangerScore, status, aiSummary } = await request.json();
    const userId = locals.session?.user?.id;
    if (!userId || !title || !description) {
        return json({ message: 'Title, description, and user ID are required' }, { status: 400 });
    }
    try {
        const id = crypto.randomUUID();
        const newCase = await db.insert(cases).values({
            id,
            title,
            description,
            dangerScore: dangerScore || 0,
            status: status || 'open',
            aiSummary: aiSummary || null,
            createdBy: userId
        }).returning();
        return json(newCase[0], { status: 201 });
    } catch (error) {
        console.error('Error adding case:', error);
        return json({ message: 'Failed to add case', details: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}
