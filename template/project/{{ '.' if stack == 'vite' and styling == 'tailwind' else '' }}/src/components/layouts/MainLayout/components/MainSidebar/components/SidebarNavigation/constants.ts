import type { LinkProps } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import type { Actions, SubjectName } from '@/lib/utils/auth/perms/types';
import { LayoutDashboardIcon, ShoppingBagIcon, TicketsIcon } from 'lucide-react';
import { PERM_ACTIONS, PERM_SUBJECTS } from '@/lib/utils/auth/perms/constants';

type SidebarNavigationLinkItem = {
    label: string;
    Icon: LucideIcon;
    linkProps: LinkProps;
    perm?: { action: Actions; subject: SubjectName };
};

export const SIDEBAR_NAVIGATION_LINK_LIST: SidebarNavigationLinkItem[] = [
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
