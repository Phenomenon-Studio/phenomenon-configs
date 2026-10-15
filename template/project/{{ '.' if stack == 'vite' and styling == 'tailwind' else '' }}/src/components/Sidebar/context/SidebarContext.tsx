import { createContext, useState } from 'react';
import { useEventListener } from '@react-hookz/web';
import { cn } from 'cn';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useSafeContext } from '@/hooks/useSafeContext';
import {
    SIDEBAR_COOKIE_MAX_AGE,
    SIDEBAR_COOKIE_NAME,
    SIDEBAR_KEYBOARD_SHORTCUT,
    SIDEBAR_WIDTH,
    SIDEBAR_WIDTH_ICON,
} from '../constants';

type SidebarContextProps = {
    state: 'expanded' | 'collapsed';
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextProps>({} as SidebarContextProps);
SidebarContext.displayName = 'SidebarContext';

export type SidebarProviderProps = React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};
export function SidebarProvider({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
}: SidebarProviderProps) {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = useState(false);
    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const open = openProp ?? internalOpen;

    const setOpen = (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === 'function' ? value(open) : value;
        if (setOpenProp) {
            setOpenProp(openState);
        } else {
            setInternalOpen(openState);
        }

        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    };

    const toggleSidebar = () => {
        if (isMobile) {
            setOpenMobile((open) => {
                return !open;
            });
        } else {
            setOpen((open) => {
                return !open;
            });
        }
    };

    useEventListener(window, 'keydown', (e: KeyboardEvent) => {
        if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            toggleSidebar();
        }
    });

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? 'expanded' : 'collapsed';

    return (
        <SidebarContext
            value={{
                state,
                open,
                setOpen,
                isMobile,
                openMobile,
                setOpenMobile,
                toggleSidebar,
            }}
        >
            <div
                style={
                    {
                        '--sidebar-width': SIDEBAR_WIDTH,
                        '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                        ...style,
                    } as React.CSSProperties
                }
                className={cn`group/sidebar-wrapper flex h-full w-full flex-col has-data-[variant=inset]:bg-sidebar md:flex-row ${className} `}
                {...props}
            >
                {children}
            </div>
        </SidebarContext>
    );
}

export const useSidebarContext = () => {
    const context = useSafeContext(SidebarContext);

    return context;
};
