import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { UsersService, UsersResponse, UserApiResponse } from './users.types';
import { useApi } from '../http/client';
import { useMemo } from 'react';

export const useUsersApiService = (): UsersService => {
  const { endpoints } = useBootstrap()
  const { get, patch } = useApi()

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

    async updateProfile(username, email, password, firstName, lastName, bio) {
      const result = await patch<UserApiResponse>(endpoints.users.me.href, {
        username: username || null,
        email: email || null,
        password: password || null,
        firstName: firstName || null,
        lastName: lastName || null,
        bio: bio || null,
      });

      if (!result.success) {
        return undefined;
      }
      return true;
    },

    async completeAvatarUpload(id) {
      const result = await patch(endpoints.users.avatar.href, { avatarMediaId: id });
      if (!result.success) {
        throw new Error('Failed to complete upload');
      }
    }
  }), [endpoints, get, patch]);
}