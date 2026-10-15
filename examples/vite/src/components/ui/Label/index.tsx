import type { LabelProps } from './types';
import { cn } from 'cn';

function Label({ className, htmlFor, ...props }: LabelProps) {
    return (
        <label
            className={cn`flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${className}`}
            htmlFor={htmlFor}
            {...props}
        />
    );
}

export { Label };
