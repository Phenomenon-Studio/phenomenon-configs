import type { MainSidebarProps } from './types';
import { Suspense } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/Sidebar';
import { SidebarNavigation } from './components/SidebarNavigation';
import { SidebarNavigationFallback } from './components/SidebarNavigationFallback';
import { SidebarProfile } from './components/SidebarProfile';
import { SidebarProfileFallback } from './components/SidebarProfileFallback';
import { SidebarTeam } from './components/SidebarTeam';

function MainSidebar(props: MainSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarTeam />
            </SidebarHeader>
            <SidebarContent>
                <Suspense fallback={<SidebarNavigationFallback />}>
                    <SidebarNavigation />
                </Suspense>
            </SidebarContent>
            <SidebarFooter>
                <Suspense fallback={<SidebarProfileFallback />}>
                    <SidebarProfile />
                </Suspense>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

export { MainSidebar };
