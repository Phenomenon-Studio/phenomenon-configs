import type { SidebarUserCardProps } from './types';
import { getRouteApi } from '@tanstack/react-router';
import { cn } from 'cn';
import { SidebarAvatar } from './components/SidebarAvatar';

const routeApi = getRouteApi('/_authenticated');

function SidebarUserCard({ className }: SidebarUserCardProps) {
    const me = routeApi.useRouteContext({
        select(context) {
            return context.auth.me;
        },
    });
    const fullName = `${me.firstName} ${me.lastName}`;

    return (
        <div className={cn`flex items-center gap-2 py-1.5 text-left text-sm ${className}`}>
            <SidebarAvatar name={`${fullName} (${me.username})`} avatarUrl={me.image} />
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{fullName}</span>
                <span className="mb-1 truncate text-xs">{me.email}</span>
            </div>
        </div>
    );
}

export { SidebarUserCard };
