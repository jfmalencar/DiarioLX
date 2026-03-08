import { useState, type ReactNode } from 'react';
import { I18nContext } from '@/shared/hooks/useI18n';
import translations from '@/assets/translations.json';

export function I18nProvider({ children }: { children: ReactNode }) {
    const [currentLang, setCurrentLang] = useState<('en' | 'pt')>('pt');

    const t = (key: string, params?: Record<string, string>) => {
        const translationsForCurrentLang = translations[currentLang] as Record<string, string> | undefined;
        let value = translationsForCurrentLang?.[key] || key;
        if (params) {
            Object.entries(params).forEach(([param, paramValue]) => {
                value = value.replace(new RegExp(`{{${param}}}`, 'g'), paramValue);
            });
        }
        return value;
    };

    return (
        <I18nContext.Provider value={{ currentLang, setLang: setCurrentLang, t }}>
            {children}
        </I18nContext.Provider>
    );
}
