import { createContext, useLayoutEffect } from 'react';
import { useLocalStorageValue, useMediaQuery } from '@react-hookz/web';
import { LS_THEME_KEY } from '@/lib/constants';
import { disableTransitionsTemporarily } from '@/lib/utils/disableTransitionsTemporarily';
import { defaultParse, defaultStringify } from '@/lib/utils/storage';
import { useSafeContext } from '@/hooks/useSafeContext';

export type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isPrefersDarkTheme?: boolean;
    isDarkTheme: boolean;
};

const ThemeProviderContext = createContext<ThemeProviderState>({} as ThemeProviderState);
ThemeProviderContext.displayName = 'ThemeProviderContext';

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = LS_THEME_KEY }: ThemeProviderProps) {
    const { value: themeLocalStorageValue, set: setThemeLocalStorageValue } = useLocalStorageValue<Theme>(storageKey, {
        defaultValue: defaultTheme,
        parse: defaultParse,
        stringify: defaultStringify,
    });
    const isPrefersDarkTheme = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = themeLocalStorageValue ?? defaultTheme;
    const isDarkTheme = (theme === 'system' && isPrefersDarkTheme) || theme === 'dark';

    useLayoutEffect(
        function setTheme() {
            const root = window.document.documentElement;
            const restoreTransitions = disableTransitionsTemporarily();
            root.classList.remove('light', 'dark');

            if (
                themeLocalStorageValue === 'system' ||
                (themeLocalStorageValue !== 'dark' && themeLocalStorageValue !== 'light')
            ) {
                root.classList.add(isPrefersDarkTheme ? 'dark' : 'light');
            } else {
                root.classList.add(themeLocalStorageValue);
            }

            restoreTransitions();
        },
        [themeLocalStorageValue, isPrefersDarkTheme, defaultTheme]
    );

    return (
        <ThemeProviderContext
            value={{
                theme,
                setTheme: setThemeLocalStorageValue,
                isPrefersDarkTheme,
                isDarkTheme,
            }}
        >
            {children}
        </ThemeProviderContext>
    );
}

export const useTheme = () => {
    const context = useSafeContext(ThemeProviderContext);

    return context;
};
