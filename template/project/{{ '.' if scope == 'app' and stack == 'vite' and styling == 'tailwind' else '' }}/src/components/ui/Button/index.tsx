import type { ButtonProps } from './types';
import { Button as BaseButtonPrimitive } from '@base-ui/react/button';
import { cn } from 'cn';
import { Loader } from '@/components/ui/Loader';
import { buttonVariants } from './utils/variants';

function Button({ className, children, variant, size, isLoading, disabled, ...props }: ButtonProps) {
    return (
        <BaseButtonPrimitive
            data-slot="button"
            className={cn`${buttonVariants({ variant, size })} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span>
                    {/**
                     * NOTE: https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/_internal/base-button.tsx
                     * We need a wrapper to set `visibility: hidden`
                     * to hide the button content whilst we show the `Spinner`.
                     * The button is a flex container with a `gap`,
                     * so we use `display: contents` to ensure the correct flex layout.
                     *
                     * However, `display: contents` removes the content from the accessibility tree in some browsers,
                     * so we force remove it with `aria-hidden` and re-add it in the tree with `VisuallyHidden`
                     */}
                    <span className="invisible contents">{children}</span>
                    <span className="sr-only">{children}</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                        <Loader />
                    </span>
                </span>
            ) : (
                children
            )}
        </BaseButtonPrimitive>
    );
}

export { Button, buttonVariants };
