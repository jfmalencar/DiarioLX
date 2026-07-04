import { Link } from 'react-router-dom';
import { useI18n } from '@/shared/hooks/useI18n';

export function PageNotFound() {
  const { t } = useI18n();
  return (
    <div
      className='d-flex flex-column align-items-center justify-content-center text-center'
      style={{ minHeight: '60vh', gap: '0.75rem' }}
    >
      <span style={{ fontSize: '5rem', fontWeight: 800, lineHeight: 1, color: '#111' }}>404</span>
      <h2 className='h5 mb-1'>{t('not_found.title')}</h2>
      <p className='text-muted mb-3' style={{ maxWidth: 380 }}>
        {t('not_found.message')}
      </p>
      <Link to='/backoffice' className='btn btn-dark'>
        {t('not_found.back')}
      </Link>
    </div>
  );
}
