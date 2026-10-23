import type { Filters } from '@/lib/types';

export const authExampleKeys = {
    all() {
        return ['authExample'] as const;
    },
    listQueryKey(filters: Filters = {}) {
        return [...authExampleKeys.all(), 'list', filters] as const;
    },
    meQueryKey() {
        return [...authExampleKeys.all(), 'me'] as const;
    },
    // NOTE: We can also assign mutation keys if needed.
    // It's important to have mutation keys for comprehensive optimistic updates https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query
    loginMutationKey() {
        return [...authExampleKeys.all(), 'login'] as const;
    },
};
