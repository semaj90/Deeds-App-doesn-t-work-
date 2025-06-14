import type { PageLoad } from './$types';
import type { Criminal } from '$lib/data/types';

import { db } from '$lib/server/db';
import { criminals } from '$lib/server/db/schema';

export const load: PageLoad = async () => {
    const allCriminals = await db.select().from(criminals);
    return {
        criminals: allCriminals as Criminal[]
    };
};