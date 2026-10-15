import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { router } from '@/lib/@router';
import { ONE_MINUTE } from '@/lib/constants';
import { removeAuthToken, removeRefreshToken, setAuthToken, setRefreshToken } from '@/lib/utils/auth/tokens';
import { login, logout, me } from './api';
import { authExampleKeys } from './queryKeys';

export const meQueryOptions = () => {
    return queryOptions({
        queryKey: authExampleKeys.meQueryKey(),
        queryFn: me,
        staleTime: ONE_MINUTE,
    });
};

export const loginMutationOptions = () => {
    return mutationOptions({
        mutationKey: authExampleKeys.loginMutationKey(),
        mutationFn: login,
        onSuccess(data, _variables, _onMutateResult, { client }) {
            setAuthToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            return client.query({ ...meQueryOptions(), staleTime: 0 });
        },
    });
};

export const logoutMutationOptions = () => {
    return mutationOptions({
        mutationFn: logout,
        onSuccess(_data, _variables, _onMutateResult, { client }) {
            removeAuthToken();
            removeRefreshToken();
            client.clear();
            router.invalidate();
        },
    });
};
