import type {
    EmptyContentProps,
    EmptyDescriptionProps,
    EmptyHeaderProps,
    EmptyMediaProps,
    EmptyProps,
    EmptyTitleProps,
} from './types';
import { cn } from 'cn';
import { emptyMediaVariants } from './utils/variants';

function Empty({ className, ...props }: EmptyProps) {
    return (
        <div
            data-slot="empty"
            className={cn`flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance ${className}`}
            {...props}
        />
    );
}

function EmptyHeader({ className, ...props }: EmptyHeaderProps) {
    return (
        <header
            data-slot="empty-header"
            className={cn`flex max-w-sm flex-col items-center gap-2 ${className}`}
            {...props}
        />
    );
}

function EmptyMedia({ className, variant = 'default', ...props }: EmptyMediaProps) {
    return (
        <div
            data-slot="empty-icon"
            data-variant={variant}
            className={cn`${emptyMediaVariants({ variant })} ${className}`}
            {...props}
        />
    );
}

function EmptyTitle({ className, children, ...props }: EmptyTitleProps) {
    return (
        <h2 data-slot="empty-title" className={cn`text-sm font-medium tracking-tight ${className}`} {...props}>
            {children}
        </h2>
    );
}

function EmptyDescription({ className, ...props }: EmptyDescriptionProps) {
    return (
        <p
            data-slot="empty-description"
            className={cn`text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary ${className}`}
            {...props}
        />
    );
}

function EmptyContent({ className, ...props }: EmptyContentProps) {
    return (
        <div
            data-slot="empty-content"
            className={cn`flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance ${className}`}
            {...props}
        />
    );
}

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia, emptyMediaVariants };
