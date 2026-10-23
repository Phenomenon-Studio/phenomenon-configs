import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { FALLBACK_REDIRECT } from '@/lib/constants';
import { getAuthToken } from '@/lib/utils/auth/tokens';

export const Route = createFileRoute('/_unauthenticated')({
    validateSearch: z.object({
        redirect: z.string().optional().catch(''),
    }),
    beforeLoad({ search }) {
        if (getAuthToken()) {
            throw redirect({
                to: search.redirect || FALLBACK_REDIRECT,
                replace: true,
            });
        }
    },
    component: RouteWrap,
});

function RouteWrap() {
    return <Outlet />;
}
