import type { InputProps } from './types';
import { Input as InputPrimitive } from '@base-ui/react/input';
import clsx from 'clsx';
import { resolveClassName } from '@/lib/utils/resolveClassName';
import s from './styles.module.css';

function Input({ className, ...props }: InputProps) {
    return (
        <InputPrimitive
            data-slot="input"
            className={(state) => {
                return clsx(s.input, resolveClassName(className, state));
            }}
            {...props}
        />
    );
}

export { Input };
