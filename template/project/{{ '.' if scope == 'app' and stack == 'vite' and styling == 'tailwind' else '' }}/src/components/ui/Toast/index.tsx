import type {
    ToastActionProps,
    ToastCloseProps,
    ToastContentProps,
    ToastContentState,
    ToastDescriptionProps,
    ToasterProps,
    ToastIconProps,
    ToastPortalProps,
    ToastProps,
    ToastProviderProps,
    ToastTitleProps,
    ToastViewportProps,
} from './types';
import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { cn } from 'cn';
import { XIcon } from 'lucide-react';
import { resolveClassName } from '@/lib/utils/resolveClassName';
import { Button } from '@/components/ui/Button';
import { TOAST_ICONS } from './constants';
import { getToastTransform } from './utils/getToastTransform';

const toast = ToastPrimitive.createToastManager();

function ToastProvider(props: ToastProviderProps) {
    return <ToastPrimitive.Provider {...props} />;
}

function ToastPortal(props: ToastPortalProps) {
    return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({ className, ...props }: ToastViewportProps) {
    return (
        <ToastPrimitive.Viewport
            data-slot="toast-viewport"
            className={cn`pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full ${className}`}
            {...props}
        />
    );
}

function Toast({ className, ...props }: ToastProps) {
    return (
        <ToastPrimitive.Root
            data-slot="toast"
            className={(state) => {
                const height = state.expanded ? 'h-(--toast-height)' : 'h-(--height)';

                return cn`group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-2xl border bg-popover text-popover-foreground shadow-lg will-change-transform outline-none select-none [--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-limited:opacity-0 motion-safe:[transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms] ${height} ${getToastTransform(state)} ${resolveClassName(className, state)}`;
            }}
            {...props}
        />
    );
}

function ToastContent({ className, ...props }: ToastContentProps) {
    return (
        <ToastPrimitive.Content
            data-slot="toast-content"
            className={(state: ToastContentState) => {
                const opacity = state.behind && !state.expanded ? 'opacity-0' : '';

                return cn`flex h-full items-center gap-3 overflow-hidden p-4 motion-safe:transition-opacity motion-safe:duration-250 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${opacity} ${resolveClassName(className, state)}`;
            }}
            {...props}
        />
    );
}

function ToastTitle({ className, ...props }: ToastTitleProps) {
    return <ToastPrimitive.Title data-slot="toast-title" className={cn`text-sm font-medium ${className}`} {...props} />;
}

function ToastDescription({ className, ...props }: ToastDescriptionProps) {
    return (
        <ToastPrimitive.Description
            data-slot="toast-description"
            className={cn`text-sm text-muted-foreground ${className}`}
            {...props}
        />
    );
}

function ToastAction({ className, render = <Button variant="outline" size="sm" />, ...props }: ToastActionProps) {
    return (
        <ToastPrimitive.Action
            data-slot="toast-action"
            render={render}
            className={cn`shrink-0 ${className}`}
            {...props}
        />
    );
}

function ToastClose({
    className,
    children,
    render = <Button variant="ghost" size="icon-sm" />,
    ...props
}: ToastCloseProps) {
    return (
        <ToastPrimitive.Close
            data-slot="toast-close"
            aria-label="Close toast"
            render={render}
            className={cn`relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground ${className}`}
            {...props}
        >
            {children ?? <XIcon aria-hidden="true" />}
        </ToastPrimitive.Close>
    );
}

function ToastIcon({ type }: ToastIconProps) {
    const Icon = type === undefined ? undefined : TOAST_ICONS[type];

    if (!Icon) {
        return null;
    }

    return (
        <span
            data-slot="toast-icon"
            data-type={type}
            className="shrink-0 data-[type=error]:text-destructive [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
        >
            <Icon aria-hidden="true" />
        </span>
    );
}

function ToastList() {
    const { toasts } = ToastPrimitive.useToastManager();

    return toasts.map((toastItem) => {
        return (
            <Toast key={toastItem.id} toast={toastItem}>
                <ToastContent>
                    <ToastIcon type={toastItem.type} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <ToastTitle />
                        <ToastDescription />
                    </div>
                    <ToastAction />
                    <ToastClose />
                </ToastContent>
            </Toast>
        );
    });
}

function Toaster({ children, toastManager = toast, ...props }: ToasterProps) {
    return (
        <ToastProvider toastManager={toastManager} {...props}>
            {children}
            <ToastPortal>
                <ToastViewport>
                    <ToastList />
                </ToastViewport>
            </ToastPortal>
        </ToastProvider>
    );
}

export {
    Toaster,
    Toast,
    ToastAction,
    ToastClose,
    ToastContent,
    ToastDescription,
    ToastPortal,
    ToastProvider,
    ToastTitle,
    ToastViewport,
    toast,
};
