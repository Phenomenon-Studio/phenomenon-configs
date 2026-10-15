import type { ButtonProps } from './types';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import clsx from 'clsx';
import { resolveClassName } from '@/lib/utils/resolveClassName';
import { Loader } from '@/components/ui/Loader';
import s from './styles.module.css';

function Button({
    className,
    children,
    variant = 'default',
    size = 'default',
    isLoading,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <ButtonPrimitive
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={(state) => {
                return clsx(s.button, resolveClassName(className, state));
            }}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    {/* Keep the label in the layout (and the accessibility tree) while the spinner covers it. */}
                    <span className={s.hidden}>{children}</span>
                    <span className={s.spinner}>
                        <Loader />
                    </span>
                </>
            ) : (
                children
            )}
        </ButtonPrimitive>
    );
}

export { Button };
