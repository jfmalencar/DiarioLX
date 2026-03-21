import { createContext, useContext } from 'react';

export type I18nState = {
  currentLang: string;
  setLang: (lang: 'en' | 'pt') => void;
  t: (key: string, params?: Record<string, string>) => string;
};

export const I18nContext = createContext<I18nState>({
  currentLang: 'pt',
  setLang: () => { },
  t: (key: string, _?: Record<string, string>) => key,
});

export function useI18n(): { lang: string; setLang: (lang: 'en' | 'pt') => void; t: (key: string, params?: Record<string, string>) => string } {
  const { currentLang, setLang, t } = useContext(I18nContext);
  return { lang: currentLang, setLang, t };
}
