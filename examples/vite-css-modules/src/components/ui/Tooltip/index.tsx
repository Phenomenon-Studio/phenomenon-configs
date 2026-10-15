import type { TooltipContentProps, TooltipProps, TooltipProviderProps, TooltipTriggerProps } from './types';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import clsx from 'clsx';
import { resolveClassName } from '@/lib/utils/resolveClassName';
import s from './styles.module.css';

function TooltipProvider({ delay = 0, ...props }: TooltipProviderProps) {
    return <TooltipPrimitive.Provider delay={delay} {...props} />;
}

function Tooltip(props: TooltipProps) {
    return <TooltipPrimitive.Root {...props} />;
}

function TooltipTrigger(props: TooltipTriggerProps) {
    return <TooltipPrimitive.Trigger {...props} />;
}

function TooltipContent({
    className,
    side = 'top',
    sideOffset = 8,
    align = 'center',
    children,
    ...props
}: TooltipContentProps) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset} align={align} className={s.positioner}>
                <TooltipPrimitive.Popup
                    className={(state) => {
                        return clsx(s.popup, resolveClassName(className, state));
                    }}
                    {...props}
                >
                    {children}
                </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
    );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
