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

/** Read the current page theme (used by the layout chrome, e.g. the header). */
export const usePageThemeState = () => useContext(PageThemeContext);

/** A page declares its theme while mounted; it resets to light on unmount. */
export const usePageTheme = (theme: PageTheme) => {
    const { setTheme } = useContext(PageThemeContext);
    useEffect(() => {
        setTheme(theme);
        return () => setTheme('light');
    }, [theme, setTheme]);
};
