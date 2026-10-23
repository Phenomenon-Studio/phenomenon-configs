import type { Filters } from '@/lib/types';

export const usersKeys = {
    all() {
        return ['users'] as const;
    },
    usersQueryKey(filters: Filters = {}) {
        return [...usersKeys.all(), 'list', filters] as const;
    },
    userQueryKey(id: number) {
        return [...usersKeys.all(), 'detail', id] as const;
    },
};
