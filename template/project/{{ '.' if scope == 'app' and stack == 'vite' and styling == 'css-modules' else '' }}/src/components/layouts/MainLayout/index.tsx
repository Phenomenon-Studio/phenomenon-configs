import { Link, Outlet } from '@tanstack/react-router';
import { useTheme } from '@/context/ThemeContext';
import { MainNavigation } from './components/MainNavigation';
import { UserMenu } from './components/UserMenu';
import s from './styles.module.css';

function MainLayout() {
    const { isDarkTheme } = useTheme();

    return (
        <div className={s.wrap}>
            <header className={s.topbar}>
                <Link to="/dashboard" className={s.logo}>
                    <img
                        src={isDarkTheme ? '/images/logo-white.svg' : '/images/logo-black.svg'}
                        alt="Phenomenon logo"
                        height={24}
                    />
                </Link>
                <MainNavigation />
                <UserMenu />
            </header>
            <main className={s.main}>
                <Outlet />
            </main>
        </div>
    );
}

export { MainLayout };
