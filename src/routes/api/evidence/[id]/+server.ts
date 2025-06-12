import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { evidence } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = 'static/uploads/evidence';

export async function GET({ params }) {
    const { id } = params;
    const evidenceItem = await db.select().from(evidence).where(eq(evidence.id, parseInt(id))).limit(1);

    if (!evidenceItem.length) {
        return json({ error: 'Evidence not found' }, { status: 404 });
    }

    return json(evidenceItem[0]);
}

export async function PUT({ params, request }) {
    const { id } = params;
    const { summary, tags, caseId, poiId } = await request.json();

    const updatedEvidence = await db.update(evidence)
        .set({
            summary: summary,
            tags: tags,
            caseId: caseId ? parseInt(caseId) : undefined,
            poiId: poiId ? parseInt(poiId) : undefined,
        })
        .where(eq(evidence.id, parseInt(id)))
        .returning();

    if (!updatedEvidence.length) {
        return json({ error: 'Evidence not found' }, { status: 404 });
    }

    return json(updatedEvidence[0]);
}

export async function DELETE({ params }) {
    const { id } = params;

    const evidenceToDelete = await db.select().from(evidence).where(eq(evidence.id, parseInt(id))).limit(1);

    if (!evidenceToDelete.length) {
        return json({ error: 'Evidence not found' }, { status: 404 });
    }

    const filePath = evidenceToDelete[0].filePath;

    try {
        // Delete the file from the local file system
        await fs.unlink(filePath);
    } catch (error) {
        console.warn(`Failed to delete file ${filePath}:`, error);
        // Continue with database deletion even if file deletion fails
    }

    await db.delete(evidence).where(eq(evidence.id, parseInt(id)));

    return new Response(null, { status: 204 });
}