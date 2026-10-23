import { SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuSkeleton } from '@/components/Sidebar';

function SidebarNavigationFallback() {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {Array.from({ length: 7 }).map((_, index) => {
                    return (
                        // eslint-disable-next-line @eslint-react/no-array-index-key -- static skeleton, never reorders
                        <SidebarMenuItem key={index}>
                            <SidebarMenuSkeleton showIcon={true} />
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export { SidebarNavigationFallback };
