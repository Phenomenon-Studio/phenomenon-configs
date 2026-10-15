import type { AuthenticatedState } from '@/services/authExample/types';
import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router';
import { createAppAbility } from '@/lib/utils/auth/perms/createAppAbility';
import { getAuthToken, removeAuthToken, removeRefreshToken } from '@/lib/utils/auth/tokens';
import { PermsProvider } from '@/context/PermsContext';
import { meQueryOptions } from '@/services/authExample/queries';
import { MainLayout } from '@/components/layouts/MainLayout';

export const Route = createFileRoute('/_authenticated')({
    async beforeLoad({ context: { queryClient }, location }) {
        const unauthRedirectOptions = {
            to: '/login',
            search: { redirect: location.href },
            replace: true,
        } as const;

        if (!getAuthToken()) {
            throw redirect(unauthRedirectOptions);
        }

        try {
            const me = await queryClient.query({ ...meQueryOptions(), staleTime: 'static' });

            return {
                auth: { isAuthenticated: true, me } satisfies AuthenticatedState,
                ability: createAppAbility(me),
            };
        } catch (error) {
            if (isRedirect(error)) {
                throw error;
            }

            removeAuthToken();
            removeRefreshToken();
            throw redirect(unauthRedirectOptions);
        }
    },
    component: RouteWrap,
});

function RouteWrap() {
    return (
        <PermsProvider from="/_authenticated">
            <MainLayout />
        </PermsProvider>
    );
}
