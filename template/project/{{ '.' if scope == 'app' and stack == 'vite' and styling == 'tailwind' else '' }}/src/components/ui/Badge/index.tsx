import type { BadgeProps } from './types';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cn } from 'cn';
import { badgeVariants } from './utils/variants';

function Badge({ className, variant = 'default', render, ...props }: BadgeProps) {
    return useRender({
        defaultTagName: 'span',
        props: mergeProps<'span'>(
            {
                className: cn`${badgeVariants({ variant })} ${className}`,
            },
            props
        ),
        render,
        state: {
            slot: 'badge',
            variant,
        },
    });
}

export { Badge, badgeVariants };
