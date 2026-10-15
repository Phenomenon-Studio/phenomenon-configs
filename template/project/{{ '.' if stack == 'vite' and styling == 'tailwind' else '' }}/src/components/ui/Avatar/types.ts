import type { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';

export type AvatarProps = AvatarPrimitive.Root.Props & {
    size?: 'default' | 'sm' | 'lg';
};

export type AvatarImageProps = AvatarPrimitive.Image.Props;

export type AvatarFallbackProps = AvatarPrimitive.Fallback.Props;

export type AvatarBadgeProps = React.ComponentProps<'span'>;

export type AvatarGroupProps = React.ComponentProps<'div'>;

export type AvatarGroupCountProps = React.ComponentProps<'div'>;
