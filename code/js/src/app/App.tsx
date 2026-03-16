import { createBrowserRouter, RouterProvider } from 'react-router';

import { I18nProvider } from '@/app/providers/I18nProvider';
import { AuthenticationProvider } from '@/app/providers/AuthenticationProvider';
//import { BootstrapProvider } from '@/app/providers/BootstrapProvider';

import { Home } from '@/modules/public/Home';
import { Category } from '@/modules/public/Category';
import { Categories } from '@/modules/public/Categories';
import { Login } from '@/modules/admin/Login';
import { Homepage } from '@/modules/admin/Homepage';
import { Users } from '@/modules/admin/Users';
import { Articles } from '@/modules/admin/Articles';

import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { RequireAuthentication } from '@/shared/components/RequireAuthentication';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'categorias',
        element: <Categories />,
      },
      {
        path: 'categorias/:id',
        element: <Category />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        index: true,
        element: (
          <RequireAuthentication>
            <Homepage />
          </RequireAuthentication>
        ),
        handle: {
          title: 'admin_layout.homepage',
          subtitle: 'admin_layout.homepage_subtitle',
        }
      },
      {
        path: 'utilizadores',
        element: (
          <RequireAuthentication>
            <Users />
          </RequireAuthentication>
        ),
        handle: {
          title: 'admin_layout.users',
          subtitle: 'admin_layout.users_subtitle',
        }
      },
      {
        path: 'publicacoes',
        element: (
          <RequireAuthentication>
            <Articles />
          </RequireAuthentication>
        ),
        handle: {
          title: 'admin_layout.publications',
          subtitle: 'admin_layout.publications_subtitle',
        }
      },
    ]
  }
]);

export function App() {
  return (
    //<BootstrapProvider>
    <I18nProvider>
      <AuthenticationProvider>
        <RouterProvider router={router} />
      </AuthenticationProvider>
    </I18nProvider>
    //</BootstrapProvider>
  );
}
