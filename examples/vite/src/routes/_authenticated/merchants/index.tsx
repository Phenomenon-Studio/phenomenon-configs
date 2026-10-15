import { createFileRoute, notFound } from '@tanstack/react-router';
import { PERM_ACTIONS, PERM_SUBJECTS } from '@/lib/utils/auth/perms/constants';
import { usersQueryOptions } from '@/services/users/queries';
import { Merchants } from '@/modules/Merchants';

export const Route = createFileRoute('/_authenticated/merchants/')({
    beforeLoad({ context: { ability } }) {
        if (ability.cannot(PERM_ACTIONS.READ, PERM_SUBJECTS.MERCHANT)) {
            throw notFound();
        }
    },
    async loader({ context: { queryClient } }) {
        await queryClient.query({ ...usersQueryOptions(), staleTime: 'static' });
    },
    component: Merchants,
});
