import { Link } from 'react-router-dom';

import { usePageTheme } from '@/shared/hooks/usePageTheme';
import { useI18n } from '@/shared/hooks/useI18n';

export function NotFound() {
    usePageTheme('light');
    const { t } = useI18n();

    return (
        <div
            data-testid='not-found'
            className='container d-flex flex-column align-items-center justify-content-center text-center px-4'
            style={{ minHeight: '60vh' }}
        >
            <div
                className='font-noticia fw-bold'
                style={{ fontSize: 'clamp(5rem, 20vw, 12rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
            >
                404
            </div>
            <h1 className='fw-semibold mt-3 mb-2' style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}>
                {t('not_found.title')}
            </h1>
            <p className='text-secondary mb-4' style={{ maxWidth: 440 }}>
                {t('not_found.description')}
            </p>
            <Link to='/' data-testid='home-link' className='btn btn-dark px-4 py-2 rounded'>
                {t('not_found.home_link')}
            </Link>
        </div>
    );
}
