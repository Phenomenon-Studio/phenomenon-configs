import type { LoaderProps } from './types';
import clsx from 'clsx';
import { LoaderCircleIcon } from 'lucide-react';
import s from './styles.module.css';

function Loader({ className, size = 16, ...props }: LoaderProps) {
    return <LoaderCircleIcon className={clsx(s.loader, className)} size={size} aria-hidden={true} {...props} />;
}

export { Loader };
