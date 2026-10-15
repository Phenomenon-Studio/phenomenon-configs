import type { PasswordInputProps } from './types';
import { useToggle } from '@react-hookz/web';
import clsx from 'clsx';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { resolveClassName } from '@/lib/utils/resolveClassName';
import { Input } from '@/components/ui/Input';
import s from './styles.module.css';

function PasswordInput({ className, disabled, id, ...props }: PasswordInputProps) {
    const [isVisible, toggleIsVisible] = useToggle();
    const Icon = isVisible ? EyeOffIcon : EyeIcon;

    return (
        <div className={s.wrap}>
            <Input
                id={id}
                className={(state) => {
                    return clsx(s.input, resolveClassName(className, state));
                }}
                type={isVisible ? 'text' : 'password'}
                disabled={disabled}
                {...props}
            />
            <button
                className={s.toggle}
                type="button"
                onClick={toggleIsVisible}
                disabled={disabled}
                aria-pressed={isVisible}
                aria-controls={id}
            >
                <Icon size={16} strokeWidth={2} aria-hidden={true} />
                <span className="sr-only">{isVisible ? 'Hide password' : 'Show password'}</span>
            </button>
        </div>
    );
}

export { PasswordInput };
