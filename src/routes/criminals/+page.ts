import type { PageLoad } from './$types';
import type { Criminal } from '$lib/data/types';

export const load: PageLoad = async ({ parent }) => {
    const { criminals } = await parent();
    return {
        criminals: criminals as Criminal[]
    };
};