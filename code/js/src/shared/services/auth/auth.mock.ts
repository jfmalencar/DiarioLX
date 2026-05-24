import { useMemo } from 'react';

import type { AuthService } from './auth.types';

import { setFakeUser } from '../users/users.mock';
import type { UserRole } from '../users/users.types';

export const useAuthMockService = (): AuthService => {
  return useMemo<AuthService>(() => ({
    async authenticate(username, password) {
      if (password === "test") {
        const fakeUser = {
          userId: '1',
          username,
          email: `${username}@diariqlx.pt`,
          firstName: 'Test',
          lastName: 'User',
          bio: 'Test user bio',
          profilePictureURL: 'https://placehold.co/213x213',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          role: 'EDITOR' as UserRole,
          isActive: true,
        };
        setFakeUser(fakeUser);
        cookieStore.set('authUser', JSON.stringify(fakeUser));
        return true;
      }
      return undefined;
    },

    async logout() {
      setFakeUser(undefined);
    },

    async register(username, email, _password, firstName, lastName) {
      const fakeUser = {
        userId: '1',
        username,
        email,
        firstName,
        lastName,
        bio: '',
        profilePictureURL: 'https://placehold.co/213x213',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'CONTRIBUTOR' as UserRole,
        isActive: true,
      };
      setFakeUser(fakeUser);
      return true
    },
  }), []);
}
