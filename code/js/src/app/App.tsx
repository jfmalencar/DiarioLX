import { createBrowserRouter, RouterProvider } from 'react-router';

import { I18nProvider } from '@/app/providers/I18nProvider';
import { AuthenticationProvider } from '@/app/providers/AuthenticationProvider';
//import { BootstrapProvider } from '@/app/providers/BootstrapProvider';

import { Home } from '@/modules/public/Home';
import { Category } from '@/modules/public/Category';
import { Categories } from '@/modules/public/Categories';
import { Login } from '@/modules/admin/Login';
import { Dashboard } from '@/modules/admin/Dashboard';
import { Users } from '@/modules/admin/Users';

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
        index: true,
        element: <RequireAuthentication><Dashboard/></RequireAuthentication>,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'users',
        element: <RequireAuthentication><Users/></RequireAuthentication>,
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
