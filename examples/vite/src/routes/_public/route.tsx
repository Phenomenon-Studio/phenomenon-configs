import type { AuthenticatedState, UnauthenticatedState } from '@/services/authExample/types';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { createAppAbility } from '@/lib/utils/auth/perms/createAppAbility';
import { getAuthToken } from '@/lib/utils/auth/tokens';
import { PermsProvider } from '@/context/PermsContext';
import { meQueryOptions } from '@/services/authExample/queries';

export const Route = createFileRoute('/_public')({
    async beforeLoad({ context: { queryClient } }) {
        if (!getAuthToken()) {
            return {
                auth: {
                    me: null,
                    isAuthenticated: false,
                } satisfies UnauthenticatedState,
                ability: createAppAbility(),
            };
        }

        try {
            const me = await queryClient.query({ ...meQueryOptions(), staleTime: 'static' });

            return {
                auth: { me, isAuthenticated: true } satisfies AuthenticatedState,
                ability: createAppAbility(me),
            };
        } catch {
            return {
                auth: { me: null, isAuthenticated: false } satisfies UnauthenticatedState,
                ability: createAppAbility(),
            };
        }
    },
    component: RouteWrap,
});

function RouteWrap() {
    return (
        <PermsProvider from="/_public">
            <Outlet />
        </PermsProvider>
    );
}
