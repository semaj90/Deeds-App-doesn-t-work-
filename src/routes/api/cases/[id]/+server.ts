import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { cases } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/cases/[id] - Get a single case by ID
export async function GET({ params }) {
    try {
        const caseId = parseInt(params.id);
        if (isNaN(caseId)) {
            return json({ error: 'Invalid case ID' }, { status: 400 });
        }
        const singleCase = await db.select().from(cases).where(eq(cases.id, caseId)).limit(1);
        if (singleCase.length === 0) {
            return json({ error: 'Case not found' }, { status: 404 });
        }
        return json(singleCase[0]);
    } catch (error) {
        console.error(`Error fetching case with ID ${params.id}:`, error);
        return json({ error: 'Failed to fetch case', details: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}

// PUT /api/cases/[id] - Update a case by ID
export async function PUT({ params, request }) {
    const caseId = parseInt(params.id);
    if (isNaN(caseId)) {
        return json({ error: 'Invalid case ID' }, { status: 400 });
    }

    try {
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
            dangerScore,
            aiSummary
        } = await request.json();

        if (!name || !title || !status || !dateOpened) {
            return json({ error: 'Name, title, status, and date opened are required' }, { status: 400 });
        }

        const updatedCase = await db.update(cases)
            .set({
                name,
                title,
                summary,
                status,
                dateOpened: dateOpened ? new Date(dateOpened) : undefined,
                description,
                verdict,
                courtDates,
                linkedCriminals,
                linkedCrimes,
                notes,
                dangerScore,
                aiSummary
            })
            .where(eq(cases.id, caseId))
            .returning();

        if (updatedCase.length === 0) {
            return json({ error: 'Case not found or no changes made' }, { status: 404 });
        }
        return json(updatedCase[0]);
    } catch (error) {
        console.error(`Error updating case with ID ${params.id}:`, error);
        return json({ error: 'Failed to update case', details: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}

// DELETE /api/cases/[id] - Delete a case by ID
export async function DELETE({ params }) {
    try {
        const caseId = parseInt(params.id);
        if (isNaN(caseId)) {
            return json({ error: 'Invalid case ID' }, { status: 400 });
        }
        const deletedCase = await db.delete(cases)
            .where(eq(cases.id, caseId))
            .returning();
        if (deletedCase.length === 0) {
            return json({ error: 'Case not found' }, { status: 404 });
        }
        return json({ message: 'Case deleted successfully' });
    } catch (error) {
        console.error(`Error deleting case with ID ${params.id}:`, error);
        return json({ error: 'Failed to delete case', details: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}
