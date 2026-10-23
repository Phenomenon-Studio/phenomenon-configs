import type { Filters } from '@/lib/types';
import { queryOptions } from '@tanstack/react-query';
import { getUser, getUsers } from './api';
import { usersKeys } from './queryKeys';

export const usersQueryOptions = (filters: Filters = {}) => {
    return queryOptions({
        queryKey: usersKeys.usersQueryKey(filters),
        queryFn: getUsers,
    });
};

export const userQueryOptions = (id: number) => {
    return queryOptions({
        queryKey: usersKeys.userQueryKey(id),
        queryFn() {
            return getUser(id);
        },
    });
};
