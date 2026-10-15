import { Link } from '@tanstack/react-router';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/Sidebar';

function SidebarTeam() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    render={
                        <Link to="/dashboard">
                            <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar text-sidebar-primary-foreground">
                                <img src="/icon.svg" className="size-8" alt="" aria-hidden={true} />
                            </span>
                            <span className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Phenomenon admin panel</span>
                            </span>
                        </Link>
                    }
                />
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export { SidebarTeam };
