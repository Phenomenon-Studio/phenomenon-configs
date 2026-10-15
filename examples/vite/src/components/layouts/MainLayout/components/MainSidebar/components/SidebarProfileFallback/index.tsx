import { SidebarMenu, SidebarMenuItem } from '@/components/Sidebar';
import { Skeleton } from '@/components/ui/Skeleton';

function SidebarProfileFallback() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex h-16 items-center px-2 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:px-0 group-data-[state=expanded]:gap-2 motion-safe:transition-[width,height,padding]">
                    <Skeleton className="size-8 shrink-0 rounded-full" />
                    <div className="grid flex-1 gap-2 text-left text-sm leading-tight">
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-3/4" />
                    </div>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export { SidebarProfileFallback };
