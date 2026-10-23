import type { LabelProps } from './types';
import clsx from 'clsx';
import s from './styles.module.css';

function Label({ className, htmlFor, children, ...props }: LabelProps) {
    return (
        <label data-slot="label" className={clsx(s.label, className)} htmlFor={htmlFor} {...props}>
            {children}
        </label>
    );
}

export { Label };
