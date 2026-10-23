import type { LucideIcon } from 'lucide-react';

export type EmptyStateProps = React.PropsWithChildren<{
    Icon?: LucideIcon;
    title: React.ReactNode;
    description?: React.ReactNode;
    className?: string;
}>;
