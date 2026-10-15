import type { QueryClient } from '@tanstack/react-query';
import type { AppAbility } from '@/lib/utils/auth/perms/types';
import type { AuthContext } from '@/services/authExample/types';
import { routeTree } from '@/routeTree.gen';
import { createRouter } from '@tanstack/react-router';
import { queryClient } from '@/lib/@queryClient';
import { createAppAbility } from '@/lib/utils/auth/perms/createAppAbility';
import { ErrorComponent } from '@/components/ErrorComponent';
import { NotFound } from '@/components/NotFound';
import { Loader } from '@/components/ui/Loader';

type RouterContext = { queryClient: QueryClient; auth: AuthContext; ability: AppAbility };

const router = createRouter({
    routeTree,
    context: {
        queryClient,
        auth: { isAuthenticated: false, me: null },
        ability: createAppAbility(),
    },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    defaultPendingMs: 100,
    defaultPendingMinMs: 500,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: ErrorComponent,
    defaultPendingComponent() {
        return <Loader size={64} className="page-loader" />;
    },
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export { router, type RouterContext };
