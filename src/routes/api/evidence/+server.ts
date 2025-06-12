import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { evidence } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = 'static/uploads/evidence';

// Ensure the upload directory exists
async function ensureUploadDir() {
    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
        console.error('Failed to create upload directory:', error);
    }
}

ensureUploadDir();

export async function GET() {
    const allEvidence = await db.select().from(evidence);
    return json(allEvidence);
}

export async function POST({ request }) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caseId = formData.get('caseId') as string;
    const poiId = formData.get('poiId') as string | null;

    if (!file) {
        return json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!caseId) {
        return json({ error: 'caseId is required' }, { status: 400 });
    }

    const fileExtension = path.extname(file.name);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFileName);

    try {
        // Save the file to the local file system
        await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

        // TODO: Implement AI summarization and tagging here
        // For now, a placeholder summary and tags
        const fileSummary = `Summary of ${file.name}`;
        const fileTags = ['uploaded', file.type.split('/')[0]];

        const newEvidence = await db.insert(evidence).values({
            caseId: parseInt(caseId),
            poiId: poiId ? parseInt(poiId) : null,
            fileName: file.name,
            filePath: filePath,
            fileType: file.type,
            fileSize: file.size,
            summary: fileSummary,
            tags: fileTags,
            originalContent: '', // TODO: Extract content for text-based files
        }).returning();

        return json(newEvidence[0], { status: 201 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return json({ error: 'Failed to upload file' }, { status: 500 });
    }
}