import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { useAuthentication } from '@/shared/hooks/useAuthentication';

import type { UserRole } from '@/shared/services/users/users.types';

type RequireRoleProps = {
  role: UserRole;
  children: ReactNode,
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { user, hydrated } = useAuthentication(); // from our own context
  const location = useLocation(); // from React Router
  if (!hydrated) return null; // wait for session check
  if (user && user.role === role) return children;
  return <Navigate to="/admin" state={{ source: location.pathname }} replace={true} />;
}
