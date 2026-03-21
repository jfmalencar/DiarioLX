import { useContext, createContext } from 'react';

export type AuthUser = string | undefined;

export type AuthenticationState = {
  user: AuthUser;
  loading: boolean;
  hydrated: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  register: (
    username: string,
    password: string,
    inviteCode: string
  ) => Promise<AuthUser>;
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
