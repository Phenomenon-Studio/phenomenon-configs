import type { useRender } from '@base-ui/react/use-render';
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from '@/components/ui/Button';
import type { Input } from '@/components/ui/Input';
import type { Separator } from '@/components/ui/Separator';
import type { TooltipContent } from '@/components/ui/Tooltip';
import type { sidebarMenuButtonVariants } from './utils/variants';

export type SidebarProps = React.ComponentProps<'div'> & {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
};

export type SidebarContentProps = React.ComponentProps<'div'>;

export type SidebarFooterProps = React.ComponentProps<'footer'>;

export type SidebarGroupProps = React.ComponentProps<'div'>;

export type SidebarGroupActionProps = useRender.ComponentProps<'button'> & React.ComponentProps<'button'>;

export type SidebarGroupContentProps = React.ComponentProps<'div'>;

export type SidebarGroupLabelProps = useRender.ComponentProps<'div'> & React.ComponentProps<'div'>;

export type SidebarHeaderProps = React.ComponentProps<'header'>;

export type SidebarInputProps = React.ComponentProps<typeof Input>;

export type SidebarInsetProps = React.ComponentProps<'main'>;

export type SidebarMenuProps = React.ComponentProps<'ul'>;

export type SidebarMenuActionProps = useRender.ComponentProps<'button'> &
    React.ComponentProps<'button'> & {
        showOnHover?: boolean;
    };

export type SidebarMenuBadgeProps = React.ComponentProps<'div'>;

export type SidebarMenuButtonProps = useRender.ComponentProps<'button'> &
    React.ComponentProps<'button'> & {
        isActive?: boolean;
        tooltip?: string | React.ComponentProps<typeof TooltipContent>;
    } & VariantProps<typeof sidebarMenuButtonVariants>;

export type SidebarMenuItemProps = React.ComponentProps<'li'>;

export type SidebarMenuSkeletonProps = React.ComponentProps<'div'> & {
    showIcon?: boolean;
};

export type SidebarMenuSubProps = React.ComponentProps<'ul'>;

export type SidebarMenuSubButtonProps = useRender.ComponentProps<'a'> &
    React.ComponentProps<'a'> & {
        size?: 'sm' | 'md';
        isActive?: boolean;
    };

export type SidebarMenuSubItemProps = React.ComponentProps<'li'>;

export type SidebarRailProps = React.ComponentProps<'button'>;

export type SidebarSeparatorProps = React.ComponentProps<typeof Separator>;

export type SidebarTriggerProps = React.ComponentProps<'button'> & {
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof buttonVariants>;
