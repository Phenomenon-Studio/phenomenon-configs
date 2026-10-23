import type { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from './utils/variants';

export type ButtonProps = {
    isLoading?: boolean;
} & ButtonPrimitive.Props &
    VariantProps<typeof buttonVariants>;
