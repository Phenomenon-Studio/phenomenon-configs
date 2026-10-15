import type { LucideProps } from 'lucide-react';
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react';
import { Loader } from '@/components/ui/Loader';

export const TOAST_ICONS: Record<string, React.ComponentType<LucideProps>> = {
    success: CircleCheckIcon,
    info: InfoIcon,
    warning: TriangleAlertIcon,
    error: OctagonXIcon,
    loading: Loader,
};
