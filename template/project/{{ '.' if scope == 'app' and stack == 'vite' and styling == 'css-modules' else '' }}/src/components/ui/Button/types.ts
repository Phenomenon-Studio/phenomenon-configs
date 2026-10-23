import type { Button as ButtonPrimitive } from '@base-ui/react/button';

export type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export type ButtonProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
} & ButtonPrimitive.Props;
