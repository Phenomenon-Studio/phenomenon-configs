import { Link } from '@tanstack/react-router';
import { useTheme } from '@/context/ThemeContext';
import { LoginForm } from '@/components/LoginForm';

function Login() {
    const { isDarkTheme } = useTheme();

    return (
        <div className="grid h-full lg:grid-cols-2">
            <div className="relative hidden flex-col justify-between bg-black p-10 lg:flex dark:bg-white">
                <Link className="w-fit rounded-md outline-hidden focus-visible:outline-ring" to="/login">
                    <img
                        className="w-fi h-7"
                        src={isDarkTheme ? '/images/logo-black.svg' : '/images/logo-white.svg'}
                        alt="Phenomenon logo"
                    />
                </Link>
                <h3 className="text-lg text-background">Where big ideas meet bold execution</h3>
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-col items-center justify-center gap-2 lg:hidden">
                    <Link
                        to="/login"
                        className="flex w-fit items-center gap-2 rounded-md font-medium outline-hidden focus-visible:outline-ring"
                    >
                        <img
                            className="h-7 w-fit"
                            src={isDarkTheme ? '/images/logo-white.svg' : '/images/logo-black.svg'}
                            alt="Phenomenon logo"
                        />
                    </Link>
                    <h3 className="text-md">Where big ideas meet bold execution</h3>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export { Login };
