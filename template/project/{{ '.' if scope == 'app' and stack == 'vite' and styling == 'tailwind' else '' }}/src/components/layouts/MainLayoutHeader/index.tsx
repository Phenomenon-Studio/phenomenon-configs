import type { MainLayoutHeaderProps } from './types';
import { cn } from 'cn';
import { SidebarTrigger } from '@/components/Sidebar';
import { Separator } from '@/components/ui/Separator';

function MainLayoutHeader({ children, className, ...rest }: MainLayoutHeaderProps) {
    return (
        <header className={cn`-mx-6 -mt-6 flex items-center gap-2 p-6 ${className}`} {...rest}>
            <div className="flex shrink-0 items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2" />
            </div>
            {children}
        </header>
    );
}

export { MainLayoutHeader };
