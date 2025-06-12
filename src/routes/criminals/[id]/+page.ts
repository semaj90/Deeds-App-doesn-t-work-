import type { PageLoad } from './$types';
import type { Criminal } from '$lib/data/types';

export const load: PageLoad = async ({ parent }) => {
    const { criminal } = await parent();
    return {
        criminal: criminal as Criminal
    };
};