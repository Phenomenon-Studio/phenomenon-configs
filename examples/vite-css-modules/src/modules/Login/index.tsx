import { Link } from '@tanstack/react-router';
import { useTheme } from '@/context/ThemeContext';
import { LoginForm } from '@/components/LoginForm';
import s from './styles.module.css';

function Login() {
    const { isDarkTheme } = useTheme();

    return (
        <div className={s.wrap}>
            <aside className={s.brand}>
                <Link className={s['logo-link']} to="/login">
                    <img
                        className={s.logo}
                        src={isDarkTheme ? '/images/logo-black.svg' : '/images/logo-white.svg'}
                        alt="Phenomenon logo"
                    />
                </Link>
                <p className={s.tagline}>Where big ideas meet bold execution</p>
            </aside>
            <div className={s.content}>
                <div className={s['mobile-brand']}>
                    <Link className={s['logo-link']} to="/login">
                        <img
                            className={s.logo}
                            src={isDarkTheme ? '/images/logo-white.svg' : '/images/logo-black.svg'}
                            alt="Phenomenon logo"
                        />
                    </Link>
                    <p>Where big ideas meet bold execution</p>
                </div>
                <div className={s.form}>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export { Login };
