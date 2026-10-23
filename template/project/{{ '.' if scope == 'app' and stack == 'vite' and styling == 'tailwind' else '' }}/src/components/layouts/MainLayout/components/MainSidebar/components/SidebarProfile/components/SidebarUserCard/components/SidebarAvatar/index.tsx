import type { SidebarAvatarProps } from './types';
import { cn } from 'cn';
import { getNameInitials } from '@/lib/utils/getNameInitials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

function SidebarAvatar({ className, name, avatarUrl }: SidebarAvatarProps) {
    const userInitials = getNameInitials(name);

    return (
        <Avatar className={cn`h-8 w-8 rounded-lg ${className}`}>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
        </Avatar>
    );
}

export { SidebarAvatar };
