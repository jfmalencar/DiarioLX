import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { UsersService, UsersResponse, UserApiResponse } from './users.types';
import { get, patch } from '../http/client';
import { useMemo } from 'react';

export const useUsersApiService = (): UsersService => {
  const { endpoints } = useBootstrap()

  return useMemo<UsersService>(() => ({
    async fetchAll(params) {
      const result = await get<UsersResponse>(`${endpoints.users.list.href}?` + new URLSearchParams(params as Record<string, string>).toString());
      if (!result.success) {
        throw new Error('Failed to fetch users');
      }
      return result.data;
    },

    async getCurrentUser() {
      const result = await get<UserApiResponse>(endpoints.users.me.href);
      if (!result.success) {
        return undefined;
      }
      return result.data;
    },

    async updateProfile(username, email, password, firstName, lastName, bio, profilePictureURL) {
      const result = await patch<UserApiResponse>(endpoints.users.me.href, {
        username: username || null,
        email: email || null,
        password: password || null,
        firstName: firstName || null,
        lastName: lastName || null,
        bio: bio || null,
        profilePictureURL: profilePictureURL || null,
      });

      if (!result.success) {
        return undefined;
      }

      return result.data;
    },
  }), [endpoints]);
}