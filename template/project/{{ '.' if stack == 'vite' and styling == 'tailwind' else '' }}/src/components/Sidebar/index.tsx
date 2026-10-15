import type {
    SidebarContentProps,
    SidebarFooterProps,
    SidebarGroupActionProps,
    SidebarGroupContentProps,
    SidebarGroupLabelProps,
    SidebarGroupProps,
    SidebarHeaderProps,
    SidebarInputProps,
    SidebarInsetProps,
    SidebarMenuActionProps,
    SidebarMenuBadgeProps,
    SidebarMenuButtonProps,
    SidebarMenuItemProps,
    SidebarMenuProps,
    SidebarMenuSkeletonProps,
    SidebarMenuSubButtonProps,
    SidebarMenuSubItemProps,
    SidebarMenuSubProps,
    SidebarProps,
    SidebarRailProps,
    SidebarSeparatorProps,
    SidebarTriggerProps,
} from './types';
import { useState } from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cn } from 'cn';
import { PanelLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { SIDEBAR_WIDTH_MOBILE } from './constants';
import { sidebarMenuButtonVariants } from './utils/variants';
import { useSidebarContext } from './context/SidebarContext';

function Sidebar({
    side = 'left',
    variant = 'sidebar',
    collapsible = 'offcanvas',
    className,
    children,
    ...props
}: SidebarProps) {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebarContext();

    if (collapsible === 'none') {
        return (
            <aside
                data-slot="sidebar"
                className={cn`flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground ${className}`}
                {...props}
            >
                {children}
            </aside>
        );
    }

    if (isMobile) {
        return (
            <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
                <SheetContent
                    data-sidebar="sidebar"
                    data-slot="sidebar"
                    data-mobile="true"
                    className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
                    style={
                        {
                            '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
                        } as React.CSSProperties
                    }
                    side={side}
                >
                    <SheetHeader className="sr-only">
                        <SheetTitle>Sidebar</SheetTitle>
                        <SheetDescription>Displays the mobile sidebar.</SheetDescription>
                    </SheetHeader>
                    <div className="flex h-full w-full flex-col">{children}</div>
                </SheetContent>
            </Sheet>
        );
    }

    const isFloatingOrInset = variant === 'floating' || variant === 'inset';
    const gapWidth = isFloatingOrInset
        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)';
    const containerSide =
        side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:-left-(--sidebar-width)'
            : 'right-0 group-data-[collapsible=offcanvas]:-right-(--sidebar-width)';
    // Adjust the padding for floating and inset variants.
    const containerPadding = isFloatingOrInset
        ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l';

    return (
        <aside
            className="group peer hidden text-sidebar-foreground md:block"
            data-state={state}
            data-collapsible={state === 'collapsed' ? collapsible : ''}
            data-variant={variant}
            data-side={side}
            data-slot="sidebar"
        >
            {/* This is what handles the sidebar gap on desktop */}
            <div
                data-slot="sidebar-gap"
                className={cn`relative w-(--sidebar-width) bg-transparent group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 motion-safe:transition-[width] motion-safe:duration-200 motion-safe:ease-linear ${gapWidth} `}
            />
            <div
                data-slot="sidebar-container"
                className={cn`fixed inset-y-0 z-10 hidden h-full w-(--sidebar-width) motion-safe:transition-[left,right,width] motion-safe:duration-200 motion-safe:ease-linear md:flex ${containerSide} ${containerPadding} ${className} `}
                {...props}
            >
                <div
                    data-sidebar="sidebar"
                    data-slot="sidebar-inner"
                    className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
                >
                    {children}
                </div>
            </div>
        </aside>
    );
}

function SidebarContent({ className, ...props }: SidebarContentProps) {
    return (
        <div
            data-slot="sidebar-content"
            data-sidebar="content"
            className={cn`flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden ${className} `}
            {...props}
        />
    );
}

function SidebarGroup({ className, ...props }: SidebarGroupProps) {
    return (
        <div
            data-slot="sidebar-group"
            data-sidebar="group"
            className={cn`relative flex w-full min-w-0 flex-col p-2 ${className}`}
            {...props}
        />
    );
}

function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
    return (
        <div
            data-slot="sidebar-group-content"
            data-sidebar="group-content"
            className={cn`w-full text-sm ${className}`}
            {...props}
        />
    );
}

function SidebarGroupAction({ className, render, ...props }: SidebarGroupActionProps) {
    return useRender({
        defaultTagName: 'button',
        props: mergeProps<'button'>(
            {
                className: cn`
                    text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 w-5 rounded-md p-0 focus-visible:ring-2 [&>svg]:size-4 flex aspect-square items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0
                    ${className}
                `,
            },
            props
        ),
        render,
        state: {
            slot: 'sidebar-group-action',
            sidebar: 'group-action',
        },
    });
}

function SidebarGroupLabel({ className, render, ...props }: SidebarGroupLabelProps) {
    return useRender({
        defaultTagName: 'div',
        props: mergeProps<'div'>(
            {
                className: cn`
                    text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden motion-safe:transition-[margin,opacity] motion-safe:duration-200 motion-safe:ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0
                    ${className}
                `,
            },
            props
        ),
        render,
        state: {
            slot: 'sidebar-group-label',
            sidebar: 'group-label',
        },
    });
}

function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
    return (
        <header
            data-slot="sidebar-header"
            data-sidebar="header"
            className={cn`flex flex-col gap-2 p-2 ${className}`}
            {...props}
        />
    );
}

function SidebarFooter({ className, ...props }: SidebarFooterProps) {
    return (
        <footer
            data-slot="sidebar-footer"
            data-sidebar="footer"
            className={cn`flex flex-col gap-2 p-2 ${className}`}
            {...props}
        />
    );
}

function SidebarInput({ className, ...props }: SidebarInputProps) {
    return (
        <Input
            data-slot="sidebar-input"
            data-sidebar="input"
            className={cn`h-8 w-full bg-background shadow-none ${className}`}
            {...props}
        />
    );
}

function SidebarInset({ className, ...props }: SidebarInsetProps) {
    return (
        <main
            data-slot="sidebar-inset"
            className={cn`relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 ${className} `}
            {...props}
        />
    );
}

function SidebarMenu({ className, ...props }: SidebarMenuProps) {
    return (
        <ul
            data-slot="sidebar-menu"
            data-sidebar="menu"
            className={cn`flex w-full min-w-0 flex-col gap-1 ${className}`}
            {...props}
        />
    );
}

function SidebarMenuAction({ className, render, showOnHover = false, ...props }: SidebarMenuActionProps) {
    return useRender({
        defaultTagName: 'button',
        props: mergeProps<'button'>(
            {
                className: cn`
                    text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 aspect-square w-5 rounded-md p-0 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 focus-visible:ring-2 [&>svg]:size-4 flex items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0
                    ${showOnHover && 'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0'}
                    ${className}
                `,
            },
            props
        ),
        render,
        state: {
            slot: 'sidebar-menu-action',
            sidebar: 'menu-action',
        },
    });
}

function SidebarMenuBadge({ className, ...props }: SidebarMenuBadgeProps) {
    return (
        <div
            data-slot="sidebar-menu-badge"
            data-sidebar="menu-badge"
            className={cn`pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground ${className} `}
            {...props}
        />
    );
}

function SidebarMenuButton({
    render,
    isActive = false,
    variant = 'default',
    size = 'default',
    tooltip,
    className,
    ...props
}: SidebarMenuButtonProps) {
    const { isMobile, state } = useSidebarContext();
    const comp = useRender({
        defaultTagName: 'button',
        props: mergeProps<'button'>(
            {
                className: cn`${sidebarMenuButtonVariants({ variant, size })} ${className}`,
            },
            props
        ),
        render: !tooltip ? render : <TooltipTrigger render={render} />,
        state: {
            slot: 'sidebar-menu-button',
            sidebar: 'menu-button',
            size,
            active: isActive,
        },
    });

    if (!tooltip) {
        return comp;
    }

    if (typeof tooltip === 'string') {
        tooltip = {
            children: tooltip,
        };
    }

    return (
        <Tooltip disableHoverablePopup={true}>
            {comp}
            <TooltipContent side="right" align="center" hidden={state !== 'collapsed' || isMobile} {...tooltip} />
        </Tooltip>
    );
}

function SidebarMenuItem({ className, ...rest }: SidebarMenuItemProps) {
    return (
        <li
            data-slot="sidebar-menu-item"
            data-sidebar="menu-item"
            className={cn`group/menu-item relative ${className}`}
            {...rest}
        />
    );
}

function SidebarMenuSkeleton({ className, showIcon = false, ...props }: SidebarMenuSkeletonProps) {
    const [width] = useState(() => {
        return `${Math.floor(Math.random() * 40) + 50}%`;
    });

    return (
        <div
            data-slot="sidebar-menu-skeleton"
            data-sidebar="menu-skeleton"
            className={cn`flex h-8 items-center rounded-md px-2 group-data-[state=expanded]:gap-2 ${className}`}
            {...props}
        >
            {showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}
            <Skeleton
                className="h-4 max-w-(--skeleton-width) flex-1"
                data-sidebar="menu-skeleton-text"
                style={
                    {
                        '--skeleton-width': width,
                    } as React.CSSProperties
                }
            />
        </div>
    );
}

function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
    return (
        <ul
            data-slot="sidebar-menu-sub"
            data-sidebar="menu-sub"
            className={cn`mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden ${className} `}
            {...props}
        />
    );
}

function SidebarMenuSubButton({
    render,
    size = 'md',
    isActive = false,
    className,
    ...props
}: SidebarMenuSubButtonProps) {
    return useRender({
        defaultTagName: 'a',
        props: mergeProps<'a'>(
            {
                className: cn`
                    text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground h-7 gap-2 rounded-md px-2 focus-visible:ring-2 data-[size=md]:text-sm data-[size=sm]:text-xs [&>svg]:size-4 flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0
                    ${className}
                `,
            },
            props
        ),
        render,
        state: {
            slot: 'sidebar-menu-sub-button',
            sidebar: 'menu-sub-button',
            size,
            active: isActive,
        },
    });
}

function SidebarMenuSubItem({ className, ...propsProps }: SidebarMenuSubItemProps) {
    return (
        <li
            data-slot="sidebar-menu-sub-item"
            data-sidebar="menu-sub-item"
            className={cn`group/menu-sub-item relative ${className}`}
            {...propsProps}
        />
    );
}

function SidebarRail({ className, ...props }: SidebarRailProps) {
    const { toggleSidebar } = useSidebarContext();

    return (
        <button
            data-sidebar="rail"
            data-slot="sidebar-rail"
            aria-label="Toggle Sidebar"
            tabIndex={-1}
            onClick={toggleSidebar}
            className={cn`absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 group-data-[collapsible=offcanvas]:translate-x-0 group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar hover:after:bg-sidebar-border in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize motion-safe:transition-all motion-safe:ease-linear sm:flex [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-collapsible=offcanvas]_&]:-left-2 [[data-side=right][data-state=collapsed]_&]:cursor-w-resize ${className} `}
            {...props}
        />
    );
}

function SidebarSeparator({ className, ...props }: SidebarSeparatorProps) {
    return (
        <Separator
            data-slot="sidebar-separator"
            data-sidebar="separator"
            className={cn`mx-2 w-auto bg-sidebar-border ${className}`}
            {...props}
        />
    );
}

function SidebarTrigger({ className, onClick, ...props }: SidebarTriggerProps) {
    const { toggleSidebar } = useSidebarContext();

    return (
        <Button
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="ghost"
            size="icon-sm"
            className={cn`size-7 ${className}`}
            onClick={(event) => {
                onClick?.(event);
                toggleSidebar();
            }}
            {...props}
        >
            <PanelLeftIcon />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    );
}

export { SidebarProvider } from './context/SidebarContext';
export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    sidebarMenuButtonVariants,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
};
