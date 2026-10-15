import type { LinkProps } from '@tanstack/react-router';

export type SidebarNavigationLinkProps = { tooltipText?: string } & React.ComponentProps<'a'> & LinkProps;
