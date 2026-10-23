import type { Avatar } from '@/components/ui/Avatar';

export type SidebarAvatarProps = {
    name: string;
    avatarUrl?: string;
} & Pick<React.ComponentProps<typeof Avatar>, 'className'>;
