import type { Theme } from '@/context/ThemeContext';
import { useMutation } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { getNameInitials } from '@/lib/utils/getNameInitials';
import { useTheme } from '@/context/ThemeContext';
import { logoutMutationOptions } from '@/services/authExample/queries';
import { Button } from '@/components/ui/Button';
import s from './styles.module.css';

const routeApi = getRouteApi('/_authenticated');

const THEME_OPTIONS: Array<{ value: Theme; label: string }> = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
];

function UserMenu() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const me = routeApi.useRouteContext({
        select(context) {
            return context.auth.me;
        },
    });
    const { mutate: logout, isPending: isLogOutPending } = useMutation(logoutMutationOptions());
    const fullName = `${me.firstName} ${me.lastName}`;

    return (
        <div className={s.wrap}>
            <label className={s.theme}>
                <span className="sr-only">Theme</span>
                <select
                    className={s.select}
                    value={theme}
                    onChange={(e) => {
                        setTheme(e.target.value as Theme);
                    }}
                >
                    {THEME_OPTIONS.map((option) => {
                        return (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        );
                    })}
                </select>
            </label>
            <div className={s.user}>
                {me.image ? (
                    <img className={s.avatar} src={me.image} alt="" width={32} height={32} />
                ) : (
                    <span className={s.avatar} aria-hidden={true}>
                        {getNameInitials(fullName)}
                    </span>
                )}
                <div className={s.details}>
                    <span className={s.name}>{fullName}</span>
                    <span className={s.email}>{me.email}</span>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                aria-label="Log out"
                isLoading={isLogOutPending}
                onClick={() => {
                    logout(undefined, {
                        onSuccess() {
                            navigate({
                                to: '/login',
                                ignoreBlocker: true,
                            });
                        },
                    });
                }}
            >
                <LogOut aria-hidden />
            </Button>
        </div>
    );
}

export { UserMenu };
