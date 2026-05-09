import { useI18n } from "@/shared/hooks/useI18n";

export function Homepage() {
    const { t } = useI18n();
    return (
        <div>
            <h5>{t('homepage.title')}</h5>
        </div>
    );
}