import { usePerms } from '@/context/PermsContext';
import { SidebarGroup, SidebarMenu, SidebarMenuItem } from '@/components/Sidebar';
import { useSidebarContext } from '@/components/Sidebar/context/SidebarContext';
import { SIDEBAR_NAVIGATION_LINK_LIST } from './constants';
import { SidebarNavigationLink } from './components/SidebarNavigationLink';

function SidebarNavigation() {
    const { setOpenMobile } = useSidebarContext();
    const ability = usePerms();

    return (
        <SidebarGroup>
            <SidebarMenu>
                {SIDEBAR_NAVIGATION_LINK_LIST.map((item) => {
                    if (item.perm && ability.cannot(item.perm.action, item.perm.subject)) {
                        return null;
                    }

                    return (
                        <SidebarMenuItem
                            key={item.label}
                            onClick={() => {
                                setOpenMobile(false);
                            }}
                        >
                            <SidebarNavigationLink tooltipText={item.label} {...item.linkProps}>
                                <item.Icon className="size-4" />
                                {item.label}
                            </SidebarNavigationLink>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export { SidebarNavigation };
