import type { LinkProps } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import type { Actions, SubjectName } from '@/lib/utils/auth/perms/types';
import { LayoutDashboardIcon, ShoppingBagIcon, TicketsIcon } from 'lucide-react';
import { PERM_ACTIONS, PERM_SUBJECTS } from '@/lib/utils/auth/perms/constants';

type NavigationLinkItem = {
    label: string;
    Icon: LucideIcon;
    linkProps: LinkProps;
    perm?: { action: Actions; subject: SubjectName };
};

export const NAVIGATION_LINK_LIST: NavigationLinkItem[] = [
    {
        label: 'Dashboard',
        Icon: LayoutDashboardIcon,
        linkProps: {
            to: '/dashboard',
        },
    },
    {
        label: 'Merchants',
        Icon: ShoppingBagIcon,
        linkProps: {
            to: '/merchants',
        },
        perm: { action: PERM_ACTIONS.READ, subject: PERM_SUBJECTS.MERCHANT },
    },
    {
        label: 'Vouchers',
        Icon: TicketsIcon,
        linkProps: {
            to: '/vouchers',
        },
        perm: { action: PERM_ACTIONS.READ, subject: PERM_SUBJECTS.VOUCHER },
    },
];
