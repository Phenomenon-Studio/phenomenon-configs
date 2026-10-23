import type { LoaderProps } from './types';
import { cn } from 'cn';
import { LoaderCircleIcon } from 'lucide-react';

function Loader({ className, ...props }: LoaderProps) {
    return <LoaderCircleIcon className={cn`motion-safe:animate-spin ${className}`} {...props} />;
}

export { Loader };
