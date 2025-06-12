import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { cases } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/cases - List all cases
export async function GET() {
    try {
        const allCases = await db.select().from(cases);
        return json(allCases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        return json({ error: 'Failed to fetch cases', details: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}

// POST /api/cases - Create a new case
export async function POST({ request }) {
    const {
        name,
        title,
        summary,
        status,
        dateOpened,
        description,
        verdict,
        courtDates,
        linkedCriminals,
        linkedCrimes,
        notes,
        userId // Assuming userId is passed from frontend or derived from session
    } = await request.json();

    if (!name || !title || !status || !dateOpened || !userId) {
        return json({ message: 'Name, title, status, date opened, and user ID are required' }, { status: 400 });
    }

    try {
        const newCase = await db.insert(cases).values({
            name,
            title,
            summary,
            status,
            dateOpened: dateOpened ? new Date(dateOpened) : undefined, // Pass undefined to let defaultNow() take effect if not provided
            description,
            verdict,
            courtDates,
            linkedCriminals,
            linkedCrimes,
            notes,
            userId
        }).returning();
        return json(newCase[0], { status: 201 });
    } catch (error) {
        console.error('Error adding case:', error);
        return json({ message: 'Failed to add case', details: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}
