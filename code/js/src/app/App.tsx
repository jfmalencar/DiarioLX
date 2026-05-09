import { createBrowserRouter, RouterProvider } from 'react-router';

import { I18nProvider } from '@/app/providers/I18nProvider';
import { AuthenticationProvider } from '@/app/providers/AuthenticationProvider';
//import { BootstrapProvider } from '@/app/providers/BootstrapProvider';

// Public
import { Home } from '@/modules/public/Home';
import { Category } from '@/modules/public/Category';
import { Categories } from '@/modules/public/Categories';
import { Article } from '@/modules/public/Article';

// Backoffice
import { Login } from '@/modules/backoffice/Login';
import { Homepage } from '@/modules/backoffice/Homepage';
import { Categories as BackofficeCategories } from '@/modules/backoffice/categories/Categories';
import { Tags } from '@/modules/backoffice/tags/Tags';
import { EditCategory } from '@/modules/backoffice/categories/EditCategory';
import { EditTag } from '@/modules/backoffice/tags/EditTag';
import { Users } from '@/modules/backoffice/users/Users';
import { Articles } from '@/modules/backoffice/articles/Articles';
import { EditArticle } from '@/modules/backoffice/articles/EditArticle';
import { SignUp } from '@/modules/backoffice/SignUp';
import { Invites } from '@/modules/backoffice/invites/Invites';
import { MyProfile } from '@/modules/backoffice/myProfile/MyProfile';

// Require Wrappers
import { RequireAuthentication } from '@/shared/components/RequireAuthentication';
import { RequireRole } from '@/shared/components/RequireRole';

// Layouts
import { PublicLayout } from '@/layouts/PublicLayout';
import { BackofficeLayout } from '@/layouts/BackofficeLayout';
import { ErrorPage } from '@/layouts/ErrorPage';

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
  {
    path: '/backoffice',
    element: <BackofficeLayout />,
    errorElement: <ErrorPage />,
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
          title: 'backoffice_layout.homepage',
          subtitle: 'backoffice_layout.homepage_subtitle',
          layout: 'dashboard'
        }
      },
      {
        path: 'categorias',
        element: (
          <RequireAuthentication>
            <BackofficeCategories />
          </RequireAuthentication>
        ),
        handle: {
          title: 'backoffice_layout.categories',
          subtitle: 'backoffice_layout.categories_subtitle',
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
          title: 'backoffice_layout.tags',
          subtitle: 'backoffice_layout.tags_subtitle',
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
          title: 'backoffice_layout.users',
          subtitle: 'backoffice_layout.users_subtitle',
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
          title: 'backoffice_layout.publications',
          subtitle: 'backoffice_layout.publications_subtitle',
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
          title: 'backoffice_layout.my_profile',
          subtitle: 'backoffice_layout.my_profile_subtitle',
          layout: 'dashboard'
        }
      },
      {
        path: 'convites',
        element: (
          <RequireRole role='ADMIN'>
            <Invites />
          </RequireRole>
        ),
        handle: {
          title: 'backoffice_layout.invites',
          subtitle: 'backoffice_layout.invites_subtitle',
          layout: 'dashboard'
        }
      },
      {
        path: '*',
        element: (
          <RequireAuthentication>
            <div>Page Not Found</div>
          </RequireAuthentication>
        ),
        handle: {
          title: '',
          subtitle: '',
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
