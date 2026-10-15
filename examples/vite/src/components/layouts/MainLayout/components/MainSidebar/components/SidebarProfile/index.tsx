import { ChevronsUpDown } from 'lucide-react';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/Sidebar';
import { useSidebarContext } from '@/components/Sidebar/context/SidebarContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { LogoutItem } from './components/LogoutItem';
import { SidebarUserCard } from './components/SidebarUserCard';
import { ThemeItem } from './components/ThemeItem';

function SidebarProfile() {
    const { isMobile } = useSidebarContext();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                size="lg"
                                className="h-auto data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                                tooltip="Profile"
                            >
                                <SidebarUserCard />
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        }
                    />
                    <DropdownMenuContent
                        className="w-(--anchor-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <ThemeItem />
                        <DropdownMenuSeparator />
                        <LogoutItem />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export { SidebarProfile };
