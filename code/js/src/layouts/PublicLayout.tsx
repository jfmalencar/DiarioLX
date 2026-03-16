import { Link, Outlet } from 'react-router';
import { useI18n } from '@/shared/hooks/useI18n';

export function PublicLayout() {
  const { t } = useI18n();

  return (
    <>
      <div className='layout-header'>
        <div className='nav-links'>
          <Link to='/' className='nav-link'>
            {t('public_layout.home')}
          </Link>
          <Link to='/categorias/lisboacidadeaberta' className='nav-link'>
            Lisboa, Cidade Aberta
          </Link>
          <Link to='/categorias/afundo' className='nav-link'>
            A Fundo
          </Link>
          <Link to='/categorias/especiais' className='nav-link'>
            Especiais
          </Link>
        </div>
      </div>
      <Outlet />
    </>
  );
}
