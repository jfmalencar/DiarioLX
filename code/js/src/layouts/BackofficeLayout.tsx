import { Link, Outlet, useMatches } from 'react-router';
import { useNavigate } from 'react-router';
import { FloatingActionMenu } from '@/shared/components/FloatingActionMenu';
import { LoadingScreen } from '@/shared/components/LoadingScreen';

import { usePath } from '@/shared/hooks/usePath';
import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useI18n } from '@/shared/hooks/useI18n';
import { ScrollToTop } from '@/shared/components/ScrollToTop';

import logo from '@/assets/logo.svg';
import { useState } from 'react';

type RouteHandle = {
  title: string
  subtitle: string
  layout: 'none' | 'dashboard'
}

export const BackofficeLayout = () => {
  const navigate = useNavigate();
  const { user, hydrated } = useAuthentication();
  const [ready, setReady] = useState(false);
  const { t } = useI18n();
  const { buildMediaUrl } = usePath()

  const matches = useMatches()
  const currentMatch = matches[matches.length - 1]
  const handle = currentMatch?.handle as RouteHandle
  const canManageInvites = user?.features?.includes('manage-invites')

  if (handle.layout === 'none') {
    return (
      <>
        <ScrollToTop />
        <Outlet />
      </>
    )
  }

  // Wait for authentication to hydrate before rendering dashboard
  if (!hydrated || !ready) {
    return <LoadingScreen onReady={() => setReady(true)} startProgress={50} endProgress={100} />
  }

  const options = [
    { key: 'new-content', label: 'Artigo', action: () => navigate('/backoffice/contents/new?type=ARTICLE') },
    { key: 'new-video', label: 'Vídeo', action: () => navigate('/backoffice/contents/new?type=VIDEO') },
    { key: 'new-episode', label: 'Episódio', action: () => navigate('/backoffice/contents/new?type=EPISODE') },
    { key: 'new-podcast', label: 'Podcast', action: () => navigate('/backoffice/podcasts/new') },
    { key: 'new-category', label: 'Categoria', action: () => navigate('/backoffice/categories/new') },
    { key: 'new-tag', label: 'Etiqueta', action: () => navigate('/backoffice/tags/new') },
  ]
  return (
    <div className='d-flex min-vh-100'>
      <aside
        className='bg-black text-white d-flex flex-column justify-content-between p-4 position-sticky top-0 vh-100'
        style={{ minWidth: 260 }}
      >
        <div>
          <Link to='/backoffice' className='text-decoration-none'>
            <div className='mb-5 text-center'>
              <img src={logo} alt='DiárioLX' style={{ width: 120 }} />
              <div className='mt-2 text-secondary'>Backoffice</div>
            </div>
          </Link>
          <hr className='border-secondary' />
          <div className='mt-4'>
            <p className='text-uppercase text-secondary small mb-3'>{t('backoffice_layout.manage')}</p>
            <nav className='nav flex-column gap-2'>
              <Link to='/backoffice/contents' data-testid='publications-link' className='nav-link text-white p-0'>
                {t('backoffice_layout.publications')}
              </Link>
              <Link to='/backoffice/users' data-testid='users-link' className='nav-link text-white p-0'>
                {t('backoffice_layout.users')}
              </Link>
              <Link to='/backoffice/categories' data-testid='categories-link' className='nav-link text-white p-0'>
                {t('backoffice_layout.categories')}
              </Link>
              <Link to='/backoffice/tags' data-testid='tags-link' className='nav-link text-white p-0'>
                {t('backoffice_layout.tags')}
              </Link>
            </nav>
          </div>
          <hr className='border-secondary my-4' />
          <div>
            <p className='text-uppercase text-secondary small mb-3'>{t('backoffice_layout.personal')}</p>
            <nav className='nav flex-column gap-2'>
              <Link to='/backoffice/profile' className='nav-link text-white p-0'>
                {t('backoffice_layout.profile')}
              </Link>
              {canManageInvites &&
                <Link to='/backoffice/invites' className='nav-link text-white p-0'>
                  {t('backoffice_layout.invites')}
                </Link>
              }
            </nav>
          </div>
        </div>
        <div>
          <Link to='/' className='d-block mt-2 text-secondary text-decoration-none'>
            {t('backoffice_layout.visit')}
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
              <div className='fw-semibold'>{user?.firstName} {user?.lastName}</div>
              <div className='text-secondary small'>{user?.email}</div>
            </div>
            <div
              className='rounded-circle bg-dark text-white d-flex align-items-center justify-content-center'
              style={{ width: '44px', height: '44px' }}
            >
              <img
                src={user?.profilePicturePath ? buildMediaUrl(user.profilePicturePath) : 'https://placehold.co/213x213/black/white?text=' + (user?.firstName?.charAt(0).toUpperCase() || 'U')}
                alt={user?.firstName}
                className='rounded-circle'
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </header>
        <FloatingActionMenu options={options} />
        <main className='px-5 pb-4' style={{ marginBottom: '6rem' }}>
          <Outlet />
        </main>
      </div>
      <ScrollToTop />
    </div>
  )
}
