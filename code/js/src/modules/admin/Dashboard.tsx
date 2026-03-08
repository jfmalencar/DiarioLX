import { useI18n } from "@/shared/hooks/useI18n";

export function Dashboard() {
    const { t } = useI18n();
    return (
        <div>
            <h3>{t('dashboard.title')}</h3>
        </div>
    );
}