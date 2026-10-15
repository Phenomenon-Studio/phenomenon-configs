import { getRouteApi, Link } from '@tanstack/react-router';
import { LayoutDashboardIcon, LogIn } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import s from './styles.module.css';

const routeApi = getRouteApi('/_public/');

function Home() {
    const { isDarkTheme } = useTheme();
    const isAuthenticated = routeApi.useRouteContext({
        select(context) {
            return context.auth.isAuthenticated;
        },
    });

    return (
        <main className={s.wrap}>
            <section className={s.hero}>
                <img
                    className={s.logo}
                    src={isDarkTheme ? '/images/logo-white.svg' : '/images/logo-black.svg'}
                    alt="Phenomenon Logo"
                />
                <h1 className={s.title}>
                    Welcome to the
                    <span className={s.accent}>Template Admin Panel</span>
                </h1>
                <p className={s.description}>
                    Vite, React, TypeScript, CSS Modules, Base UI, TanStack Router, TanStack Query, TanStack Form, Ky,
                    Zod, Lucide Icons
                </p>
                <div className={s.actions}>
                    {isAuthenticated ? (
                        <Button
                            variant="outline"
                            size="lg"
                            nativeButton={false}
                            render={
                                <Link to="/dashboard">
                                    Dashboard
                                    <LayoutDashboardIcon aria-hidden />
                                </Link>
                            }
                        />
                    ) : (
                        <Button
                            size="lg"
                            nativeButton={false}
                            render={
                                <Link to="/login">
                                    Login
                                    <LogIn aria-hidden />
                                </Link>
                            }
                        />
                    )}
                </div>
            </section>
        </main>
    );
}

export { Home };
