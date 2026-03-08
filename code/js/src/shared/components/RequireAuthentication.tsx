import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { useAuthentication } from '@/shared/hooks/useAuthentication';

type RequireAuthenticationProps = {
  children: ReactNode,
}
export function RequireAuthentication({ children }: RequireAuthenticationProps) {
  const { user, hydrated } = useAuthentication(); // from our own context
  const location = useLocation(); // from React Router
  if (!hydrated) return null; // wait for session check
  if (user) return children;
  return <Navigate to="/admin/login" state={{ source: location.pathname }} replace={true} />;
}