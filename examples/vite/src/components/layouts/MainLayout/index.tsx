import type { MainLayoutProps } from './types';
import { Outlet } from '@tanstack/react-router';
import { getCookieByName } from '@/lib/utils/getCookieByName';
import { SidebarInset, SidebarProvider } from '@/components/Sidebar';
import { SIDEBAR_COOKIE_NAME } from '@/components/Sidebar/constants';
import { MainSidebar } from './components/MainSidebar';

function MainLayout(props: MainLayoutProps) {
    return (
        <SidebarProvider defaultOpen={getCookieByName(SIDEBAR_COOKIE_NAME) === 'true'} {...props}>
            <MainSidebar />
            <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 p-6">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export { MainLayout };
