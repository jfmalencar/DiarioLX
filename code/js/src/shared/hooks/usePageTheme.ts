import { createContext, useContext, useEffect } from 'react';

export type PageTheme = 'light' | 'dark';

type PageThemeState = {
    theme: PageTheme;
    setTheme: (theme: PageTheme) => void;
};

export const PageThemeContext = createContext<PageThemeState>({
    theme: 'light',
    setTheme: () => { },
});

export const usePageThemeState = () => useContext(PageThemeContext);

export const usePageTheme = (theme: PageTheme) => {
    const { setTheme } = useContext(PageThemeContext);
    useEffect(() => {
        setTheme(theme);
        return () => setTheme('light');
    }, [theme, setTheme]);
};
