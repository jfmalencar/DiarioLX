import { createBrowserRouter, RouterProvider } from 'react-router';

import { I18nProvider } from '@/app/providers/I18nProvider';
import { AuthenticationProvider } from '@/app/providers/AuthenticationProvider';
import { BootstrapProvider } from '@/app/providers/BootstrapProvider';
import { SnackbarProvider } from '@/app/providers/SnackbarProvider'

// Public
import { Home } from '@/modules/public/home/Home';
import { Category } from '@/modules/public/Category';
import { Categories } from '@/modules/public/Categories';
import { Tag } from '@/modules/public/Tag';
import { TypeList } from '@/modules/public/TypeList';
import { Equipa } from '@/modules/public/Equipa';
import { Author } from '@/modules/public/Author';
import { Content } from '@/modules/public/Content';
import { NotFound } from '@/modules/public/NotFound';

// Backoffice
import { Login } from '@/modules/backoffice/Login';
import { Categories as BackofficeCategories } from '@/modules/backoffice/categories/Categories';
import { Tags } from '@/modules/backoffice/tags/Tags';
import { EditCategory } from '@/modules/backoffice/categories/EditCategory';
import { EditTag } from '@/modules/backoffice/tags/EditTag';
import { Users } from '@/modules/backoffice/users/Users';
import { Contents } from '@/modules/backoffice/contents/Contents';
import { EditContent } from '@/modules/backoffice/contents/EditContent';
import { ReviewContent } from '@/modules/backoffice/contents/ReviewContent';
import { SignUp } from '@/modules/backoffice/SignUp';
import { Invites } from '@/modules/backoffice/invites/Invites';
import { MyProfile } from '@/modules/backoffice/profile/MyProfile';
import { Homepage } from '@/modules/backoffice/home/Homepage';
import { Settings } from '@/modules/backoffice/settings/Settings';

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
        path: 'categories',
        element: <Categories />,
      },
      {
        path: 'category/:slug',
        element: <Category />,
      },
      {
        path: 'tag/:slug',
        element: <Tag />,
      },
      {
        path: 'photo-essays',
        element: <TypeList type='PHOTO_ESSAY' title='Fotografia' />,
      },
      {
        path: 'podcasts',
        element: <TypeList type='PODCAST' title='Podcasts' />,
      },
      {
        path: 'videos',
        element: <TypeList type='VIDEO' title='Vídeos' />,
      },
      {
        path: 'team',
        element: <Equipa />,
      },
      {
        path: 'author/:slug',
        element: <Author />,
      },
      {
        path: 'p/:slug',
        element: <Content />,
      },
      {
        path: '*',
        element: <NotFound />,
      }
    ],
  },
  {
    path: '/backoffice',
    element: <BackofficeLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <RequireAuthentication>
            <Homepage />,
          </RequireAuthentication>
        ),
        handle: {
          title: 'backoffice_layout.homepage',
          subtitle: 'backoffice_layout.homepage_subtitle',
          layout: 'dashboard'
        }
      },
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
        path: 'categories',
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
        path: 'categories/:id',
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
        path: 'tags',
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
        path: 'tags/:id',
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
        path: 'users',
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
        path: 'contents',
        element: (
          <RequireAuthentication>
            <Contents />
          </RequireAuthentication>
        ),
        handle: {
          title: 'backoffice_layout.publications',
          subtitle: 'backoffice_layout.publications_subtitle',
          layout: 'dashboard'
        }
      },
      {
        path: 'contents/:id/review',
        element: (
          <RequireAuthentication>
            <ReviewContent />
          </RequireAuthentication>
        ),
        handle: {
          layout: 'none'
        }
      },
      {
        path: 'contents/:id',
        element: (
          <RequireAuthentication>
            <EditContent />
          </RequireAuthentication>
        ),
        handle: {
          layout: 'none'
        }
      },
      {
        path: 'profile',
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
        path: 'invites',
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
        path: 'settings',
        element: (
          <RequireRole role='ADMIN'>
            <Settings />
          </RequireRole>
        ),
        handle: {
          title: 'backoffice_layout.settings',
          subtitle: 'backoffice_layout.settings_subtitle',
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
    <BootstrapProvider>
      <I18nProvider>
        <SnackbarProvider>
          <AuthenticationProvider>
            <RouterProvider router={router} />
          </AuthenticationProvider>
        </SnackbarProvider>
      </I18nProvider>
    </BootstrapProvider>
  );
}
