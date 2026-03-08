import { useParams } from 'react-router';
import { useI18n } from '@/shared/hooks/useI18n';

export function Category() {
    const { id } = useParams();
    const { t } = useI18n();

    if (!id) return <div>{t('category.not_found')}</div>;
    return (
        <div>
            <h3>{t('category.page', { id })}</h3>
        </div>
    );
}