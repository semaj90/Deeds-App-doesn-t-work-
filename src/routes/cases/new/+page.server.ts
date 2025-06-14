import { json, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { cases } from '$lib/server/db/schema';
import { randomUUID } from 'crypto';

export const POST = async ({ request, locals }) => {
  try {
    const { title, description, dangerScore, status, aiSummary } = await request.json();
    if (!title || !description) {
      return json({ error: 'Title and description are required.' }, { status: 400 });
    }
    const id = randomUUID();
    const createdBy = locals.session?.user?.id;
    if (!createdBy) {
      return json({ error: 'Not authenticated.' }, { status: 401 });
    }
    await db.insert(cases).values({
      id,
      title,
      description,
      dangerScore: dangerScore || 0,
      status: status || 'open',
      aiSummary: aiSummary || null,
      createdBy
    });
    return json({ id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return json({ error: 'Failed to create case.' }, { status: 500 });
  }
};
