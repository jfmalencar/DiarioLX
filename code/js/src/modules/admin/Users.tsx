import { useI18n } from "@/shared/hooks/useI18n";

export function Users() {
    const { t } = useI18n();
    return (
        <div>
            <h3>{t('users.title')}</h3>
        </div>
    );
}