import type { LucideProps } from 'lucide-react';
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react';
import { Loader } from '@/components/ui/Loader';

export const TOAST_TRANSFORMS = {
    stacked:
        'transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]',
    expanded: 'transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]',
    offscreen: 'transform-[translateY(150%)]',
    up: 'transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]',
    down: 'transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]',
    left: 'transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
    right: 'transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
} as const;

export const TOAST_ICONS: Record<string, React.ComponentType<LucideProps>> = {
    success: CircleCheckIcon,
    info: InfoIcon,
    warning: TriangleAlertIcon,
    error: OctagonXIcon,
    loading: Loader,
};
