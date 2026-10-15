import type { SidebarNavigationLinkProps } from './types';
import { Link } from '@tanstack/react-router';
import { SidebarMenuButton } from '@/components/Sidebar';

function SidebarNavigationLink({ activeProps, activeOptions, tooltipText, ...props }: SidebarNavigationLinkProps) {
    return (
        <SidebarMenuButton
            tooltip={tooltipText}
            render={
                <Link
                    activeOptions={{
                        exact: true,
                        ...activeOptions,
                    }}
                    activeProps={{
                        className: 'bg-sidebar-accent text-sidebar-accent-foreground',
                        ...activeProps,
                    }}
                    {...props}
                />
            }
        />
    );
}

export { SidebarNavigationLink };
