import { createBrowserRouter, RouterProvider } from 'react-router';

import { I18nProvider } from '@/app/providers/I18nProvider';
import { AuthenticationProvider } from '@/app/providers/AuthenticationProvider';
//import { BootstrapProvider } from '@/app/providers/BootstrapProvider';

import { Home } from '@/modules/public/Home';
import { Category } from '@/modules/public/Category';
import { Categories } from '@/modules/public/Categories';
import { Login } from '@/modules/admin/Login';
import { Homepage } from '@/modules/admin/Homepage';
import { Categories as AdminCategories } from '@/modules/admin/Categories';
import { Category as AdminCategory } from '@/modules/admin/Category';
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
        handle: {
          layout: 'none'
        }
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
          layout: 'dashboard'
        }
      },
      {
        path: 'categorias',
        element: (
          <RequireAuthentication>
            <AdminCategories />
          </RequireAuthentication>
        ),
        handle: {
          title: 'admin_layout.categories',
          subtitle: 'admin_layout.categories_subtitle',
          layout: 'dashboard'
        }
      },
      {
        path: 'categorias/:id',
        element: (
          <RequireAuthentication>
            <AdminCategory />
          </RequireAuthentication>
        ),
        handle: {
          layout: 'edit'
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
          layout: 'dashboard'
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
          layout: 'dashboard'
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
