import { useMemo } from 'react';

import type { AuthService } from './auth.types';

import { setFakeUser } from '../users/users.mock';
import type { UserRole } from '../users/users.types';

export const useAuthMockService = (): AuthService => {
  return useMemo<AuthService>(() => ({
    async authenticate(username, password) {
      if (password === "test") {
        const fakeUser = {
          userId: 1,
          username,
          email: `${username}@diariqlx.pt`,
          firstName: 'Test',
          lastName: 'User',
          position: 'Editor',
          bio: 'Test user bio',
          onTeam: false,
          profilePicturePath: 'https://placehold.co/213x213',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          role: 'EDITOR' as UserRole,
          isActive: true,
          features: ['manage-categories', 'manage-tags']
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
        userId: 1,
        username,
        email,
        firstName,
        lastName,
        position: '',
        bio: '',
        onTeam: false,
        profilePicturePath: 'https://placehold.co/213x213',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'CONTRIBUTOR' as UserRole,
        isActive: true,
        features: ['manage-categories', 'manage-tags']
      };
      setFakeUser(fakeUser);
      return true
    },

    async requestPasswordReset(username: string) {
      return;
    },

    async completePasswordReset(resetToken: string, newPassword: string) {  
      return;
    }
  }), []);
}
