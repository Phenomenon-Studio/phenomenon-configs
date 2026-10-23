import type { MainLayoutHeaderProps } from './types';
import clsx from 'clsx';
import s from './styles.module.css';

function MainLayoutHeader({ children, className, ...rest }: MainLayoutHeaderProps) {
    return (
        <header className={clsx(s.header, className)} {...rest}>
            {children}
        </header>
    );
}

export { MainLayoutHeader };
