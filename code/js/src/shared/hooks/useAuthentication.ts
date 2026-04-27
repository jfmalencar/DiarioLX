import { useContext, createContext } from 'react';
import type { RegisterResponseDTO, User } from '@/shared/services/auth/auth.types';

export type AuthUser = User | undefined;

export type AuthenticationState = {
  user: AuthUser;
  loading: boolean;
  hydrated: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    inviteCode: string
  ) => Promise<RegisterResponseDTO | undefined>;
  refreshUser: () => Promise<AuthUser>;
};

export const AuthenticationContext = createContext<AuthenticationState | undefined>(undefined);

export function useAuthentication(): AuthenticationState {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuthentication must be used within an AuthenticationProvider');
  }

  return context
}
