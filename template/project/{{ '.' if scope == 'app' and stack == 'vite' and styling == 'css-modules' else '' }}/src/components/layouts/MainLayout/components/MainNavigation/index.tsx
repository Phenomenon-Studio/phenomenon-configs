import { Link } from '@tanstack/react-router';
import { usePerms } from '@/context/PermsContext';
import { NAVIGATION_LINK_LIST } from './constants';
import s from './styles.module.css';

function MainNavigation() {
    const ability = usePerms();

    return (
        <nav aria-label="Main" className={s.nav}>
            <ul className={s.list}>
                {NAVIGATION_LINK_LIST.map((item) => {
                    if (item.perm && ability.cannot(item.perm.action, item.perm.subject)) {
                        return null;
                    }

                    return (
                        <li key={item.label}>
                            <Link
                                className={s.link}
                                activeOptions={{ exact: true }}
                                activeProps={{ className: s.active, 'aria-current': 'page' }}
                                {...item.linkProps}
                            >
                                <item.Icon size={16} aria-hidden={true} />
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export { MainNavigation };
