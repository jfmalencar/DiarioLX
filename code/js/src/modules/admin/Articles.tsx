import { useI18n } from "@/shared/hooks/useI18n";

export function Articles() {
    const { t } = useI18n();
    return (
        <div>
            <h5>{t('articles.title')}</h5>
        </div>
    );
}