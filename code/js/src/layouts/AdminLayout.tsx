import { Link, Outlet, useMatches } from 'react-router';
import { useNavigate } from 'react-router';
import { FloatingActionMenu } from '@/shared/components/FloatingActionMenu';

import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useI18n } from '@/shared/hooks/useI18n';
import { ScrollToTop } from '@/shared/components/ScrollToTop';

import logo from '@/assets/logo.svg';

type RouteHandle = {
  title: string
  subtitle: string
  layout: 'none' | 'dashboard'
}

export function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuthentication();
  const { t } = useI18n();

  const options = [
    { key: 'new-article', label: 'Artigo', action: () => navigate('/admin/publicacoes/novo') },
    { key: 'new-podcast', label: 'Podcast', action: () => navigate('/admin/podcasts/novo') },
    { key: 'new-video', label: 'Vídeo', action: () => navigate('/admin/videos/novo') },
    { key: 'new-category', label: 'Categoria', action: () => navigate('/admin/categorias/nova') },
    { key: 'new-tag', label: 'Etiqueta', action: () => navigate('/admin/etiquetas/nova') },
  ]

  const matches = useMatches()
  const currentMatch = matches[matches.length - 1]
  const handle = currentMatch?.handle as RouteHandle

  if (handle.layout === 'none') {
    return (
      <>
        <ScrollToTop />
        <Outlet />
      </>
    )
  }
  return (
    <div className='d-flex min-vh-100'>
      <aside
        className='bg-black text-white d-flex flex-column justify-content-between p-4 position-sticky top-0 vh-100'
        style={{ width: '260px' }}
      >
        <div>
          <Link to='/admin' className='text-decoration-none'>
            <div className='mb-5 text-center'>
              <img src={logo} alt='DiárioLX' style={{ width: '120px' }} />
              <div className='mt-2 text-secondary'>Backoffice</div>
            </div>
          </Link>
          <hr className='border-secondary' />
          <div className='mt-4'>
            <p className='text-uppercase text-secondary small mb-3'>{t('admin_layout.manage')}</p>
            <nav className='nav flex-column gap-2'>
              <Link to='/admin/publicacoes' data-testid='publications-link' className='nav-link text-white p-0'>
                {t('admin_layout.publications')}
              </Link>
              <Link to='/admin/utilizadores' data-testid='users-link' className='nav-link text-white p-0'>
                {t('admin_layout.users')}
              </Link>
              <Link to='/admin/categorias' data-testid='categories-link' className='nav-link text-white p-0'>
                {t('admin_layout.categories')}
              </Link>
              <Link to='/admin/etiquetas' data-testid='tags-link' className='nav-link text-white p-0'>
                {t('admin_layout.tags')}
              </Link>
            </nav>
          </div>
          <hr className='border-secondary my-4' />
          <div>
            <p className='text-uppercase text-secondary small mb-3'>{t('admin_layout.personal')}</p>
            <nav className='nav flex-column gap-2'>
              <Link to='/admin/perfil' className='nav-link text-white p-0'>
                {t('admin_layout.profile')}
              </Link>
              <Link to='/admin/acessos' className='nav-link text-white p-0'>
                {t('admin_layout.access')}
              </Link>
            </nav>
          </div>
        </div>
        <div>
          <Link to='/' className='d-block mt-2 text-secondary text-decoration-none'>
            {t('admin_layout.visit')}
          </Link>
        </div>
      </aside>
      <div className='flex-grow-1 bg-light'>
        <header className='d-flex justify-content-between align-items-start px-5 py-4'>
          <div>
            <h1 className='mb-0 mt-0 fw-medium'>{t(handle.title)}</h1>
            <p className='text-secondary fs-5 mb-0'>{t(handle.subtitle)}</p>
          </div>
          <div className='d-flex align-items-center gap-3'>
            <div className='text-end'>
              <div className='fw-semibold'>{user}</div>
              <div className='text-secondary small'>Super-Admin</div>
            </div>
            <div
              className='rounded-circle bg-dark text-white d-flex align-items-center justify-content-center'
              style={{ width: '44px', height: '44px' }}
            >
              {user?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <FloatingActionMenu options={options} />
        <main className='px-5 pb-4'>
          <Outlet />
        </main>
      </div>
      <ScrollToTop />
    </div>
  )
}
