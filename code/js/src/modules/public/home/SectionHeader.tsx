import { Link } from 'react-router-dom';

import { useI18n } from '@/shared/hooks/useI18n';

type Props = {
    title: string;
    href?: string;
}

export const SectionHeader = ({ title, href = '#' }: Props) => {
    const { t } = useI18n();
    return (
        <div className='d-flex align-items-baseline justify-content-between border-bottom border-2 border-dark pb-1 mb-3'>
            <h2
                className='mb-0 fw-bold'
                style={{ fontSize: '1.15rem' }}
            >
                {title}
            </h2>
            <Link
                to={href}
                className='text-muted text-decoration-none'
                style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}
            >
                {t('common.see_all')} →
            </Link>
        </div>
    );
};
