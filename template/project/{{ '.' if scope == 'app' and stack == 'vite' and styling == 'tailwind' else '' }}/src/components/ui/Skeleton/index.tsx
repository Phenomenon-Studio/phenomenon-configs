import type { SkeletonProps } from './types';
import { cn } from 'cn';

function Skeleton({ className, ...props }: SkeletonProps) {
    return <div className={cn`rounded-md bg-muted motion-safe:animate-pulse ${className}`} {...props} />;
}

export { Skeleton };
