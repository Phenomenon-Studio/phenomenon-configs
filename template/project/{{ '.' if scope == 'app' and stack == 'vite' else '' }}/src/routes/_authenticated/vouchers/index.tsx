import { createFileRoute, notFound } from '@tanstack/react-router';
import { PERM_ACTIONS, PERM_SUBJECTS } from '@/lib/utils/auth/perms/constants';
import { Vouchers } from '@/modules/Vouchers';

export const Route = createFileRoute('/_authenticated/vouchers/')({
    beforeLoad({ context: { ability } }) {
        if (ability.cannot(PERM_ACTIONS.READ, PERM_SUBJECTS.VOUCHER)) {
            throw notFound();
        }
    },
    component: Vouchers,
});
