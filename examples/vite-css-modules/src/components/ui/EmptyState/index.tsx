import type { EmptyStateProps } from './types';
import clsx from 'clsx';
import s from './styles.module.css';

function EmptyState({ Icon, title, description, className, children }: EmptyStateProps) {
    return (
        <section className={clsx(s.wrap, className)}>
            {Icon && (
                <span className={s.icon}>
                    <Icon size={24} aria-hidden={true} />
                </span>
            )}
            <h1 className={s.title}>{title}</h1>
            {description && <p className={s.description}>{description}</p>}
            {children && <div className={s.actions}>{children}</div>}
        </section>
    );
}

export { EmptyState };
