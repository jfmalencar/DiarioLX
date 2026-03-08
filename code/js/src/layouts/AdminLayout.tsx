import { Link, Outlet, useNavigate } from 'react-router';
import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useI18n } from '@/shared/hooks/useI18n';
import './AdminLayout.css';

export function AdminLayout() {
  const { user, logout } = useAuthentication();
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      <div className='layout-header'>
        <div className='nav-links'>
          <Link to='/admin' className='nav-link'>
            {t('admin_layout.home')}
          </Link>
          <Link to='/admin/users' className='nav-link'>
            {t('admin_layout.users')}
          </Link>
        </div>
        <div className='auth-section'>
          {user ? (
            <>
              <button
                onClick={() => navigate('/admin/profile')}
                className='profile-button'
                title={t('admin_layout.profile')}
              >
                {user.charAt(0).toUpperCase()}
              </button>
              <button
                onClick={handleLogout}
                className='auth-button logout-button'
              >
                {t('admin_layout.logout')}
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/admin/login')}
              className='auth-button'
            >
              {t('admin_layout.login')}
            </button>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}
