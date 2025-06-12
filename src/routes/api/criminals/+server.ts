import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { criminals } from '$lib/server/db/schema';
import { eq, like, sql } from 'drizzle-orm';

export async function GET({ url }) {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const searchTerm = url.searchParams.get('search') || '';
    const filterStatus = url.searchParams.get('status') || '';
    const filterThreatLevel = url.searchParams.get('threat') || '';

    const offset = (page - 1) * limit;

    let query = db.select().from(criminals).$dynamic();
    let countQuery = db.select({ count: sql`count(*)` }).from(criminals).$dynamic();

    if (searchTerm) {
        const searchPattern = `%${searchTerm.toLowerCase()}%`;
        query = query.where(
            sql`${criminals.firstName} ILIKE ${searchPattern} OR ${criminals.lastName} ILIKE ${searchPattern} OR ${criminals.address} ILIKE ${searchPattern} OR ${criminals.email} ILIKE ${searchPattern}`
        );
        countQuery = countQuery.where(
            sql`${criminals.firstName} ILIKE ${searchPattern} OR ${criminals.lastName} ILIKE ${searchPattern} OR ${criminals.address} ILIKE ${searchPattern} OR ${criminals.email} ILIKE ${searchPattern}`
        );
    }

    if (filterStatus) {
        query = query.where(eq(criminals.convictionStatus, filterStatus));
        countQuery = countQuery.where(eq(criminals.convictionStatus, filterStatus));
    }

    if (filterThreatLevel) {
        query = query.where(eq(criminals.threatLevel, filterThreatLevel));
        countQuery = countQuery.where(eq(criminals.threatLevel, filterThreatLevel));
    }

    const fetchedCriminals = await query.limit(limit).offset(offset);
    const totalCriminalsResult = await countQuery;
    const totalCriminals = totalCriminalsResult[0].count;

    return json({ criminals: fetchedCriminals, totalCriminals });
}

export async function POST({ request }) {
    const {
        firstName,
        lastName,
        dateOfBirth,
        address,
        phone,
        email,
        photoUrl,
        convictionStatus,
        threatLevel,
        sentenceLength,
        convictionDate,
        escapeAttempts,
        gangAffiliations,
        notes
    } = await request.json();

    try {
        const newCriminal = await db.insert(criminals).values({
            firstName,
            lastName,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            address,
            phone,
            email,
            photoUrl,
            convictionStatus,
            threatLevel,
            sentenceLength,
            convictionDate: convictionDate ? new Date(convictionDate) : null,
            escapeAttempts,
            gangAffiliations,
            notes
        }).returning();
        return json(newCriminal[0], { status: 201 });
    } catch (error) {
        console.error('Error adding criminal:', error);
        return json({ message: 'Failed to add criminal' }, { status: 500 });
    }
}