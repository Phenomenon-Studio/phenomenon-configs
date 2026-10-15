import type { PasswordInputProps } from './types';
import { useToggle } from '@react-hookz/web';
import { cn } from 'cn';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input } from '@/components/ui/Input';

function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
    const [isVisible, toggleIsVisible] = useToggle();
    const Icon = isVisible ? EyeOffIcon : EyeIcon;

    return (
        <div className="relative">
            <Input
                className={cn`pe-9 ${className}`}
                type={isVisible ? 'text' : 'password'}
                disabled={disabled}
                {...props}
            />
            <button
                className="absolute inset-y-0 inset-e-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 hover:text-foreground focus-visible:z-10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors"
                type="button"
                onClick={toggleIsVisible}
                disabled={disabled}
                aria-pressed={isVisible}
                aria-controls="password"
            >
                <Icon size={16} strokeWidth={2} aria-hidden={true} />
                <span className="sr-only">{isVisible ? 'Hide password' : 'Show password'}</span>
            </button>
        </div>
    );
}

export { PasswordInput };
