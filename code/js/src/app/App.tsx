import { createBrowserRouter, RouterProvider } from 'react-router';

import { I18nProvider } from '@/app/providers/I18nProvider';
import { AuthenticationProvider } from '@/app/providers/AuthenticationProvider';
//import { BootstrapProvider } from '@/app/providers/BootstrapProvider';

import { Home } from '@/modules/public/Home';
import { Category } from '@/modules/public/Category';
import { Categories } from '@/modules/public/Categories';
import { Login } from '@/modules/admin/Login';
import { Homepage } from '@/modules/admin/Homepage';
import { Categories as AdminCategories } from '@/modules/admin/categories/Categories';
import { Tags } from '@/modules/admin/tags/Tags';
import { EditCategory } from '@/modules/admin/categories/EditCategory';
import { EditTag } from '@/modules/admin/tags/EditTag';
import { Users } from '@/modules/admin/users/Users';
import { Articles } from '@/modules/admin/articles/Articles';
import { EditArticle } from '@/modules/admin/articles/EditArticle';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { RequireAuthentication } from '@/shared/components/RequireAuthentication';
import { SignUp } from '@/modules/admin/SignUp';

import { FileUpload } from '@/modules/public/File';
import { Article } from '@/modules/public/Article';
import { MyProfile } from '@/modules/admin/myProfile/MyProfile';

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
      {
        path: 'p/:slug',
        element: <Article />,
      }
    ],
  },
  { path: '/file-upload', element: <FileUpload /> },
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
        path: 'register',
        element: <SignUp />,
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
            <EditCategory />
          </RequireAuthentication>
        ),
        handle: {
          layout: 'none'
        }
      },
      {
        path: 'etiquetas',
        element: (
          <RequireAuthentication>
            <Tags />
          </RequireAuthentication>
        ),
        handle: {
          title: 'admin_layout.tags',
          subtitle: 'admin_layout.tags_subtitle',
          layout: 'dashboard'
        }
      },
      {
        path: 'etiquetas/:id',
        element: (
          <RequireAuthentication>
            <EditTag />
          </RequireAuthentication>
        ),
        handle: {
          layout: 'none'
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
      {
        path: 'publicacoes/:id',
        element: (
          <RequireAuthentication>
            <EditArticle />
          </RequireAuthentication>
        ),
        handle: {
          layout: 'none'
        }
      },
      {
        path: 'perfil',
        element: (
          <RequireAuthentication>
            <MyProfile />
          </RequireAuthentication>
        ),
        handle: {
          title: 'admin_layout.my_profile',
          subtitle: 'admin_layout.my_profile_subtitle',
          layout: 'dashboard'
        }
      }
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
