import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { UsersService, UsersResponse, UserApiResponse } from './users.types';
import { useApi } from '../http/client';
import { useMemo } from 'react';

export const useUsersApiService = (): UsersService => {
  const { endpoints } = useBootstrap()
  const { get, patch, remove, post } = useApi()

  return useMemo<UsersService>(() => ({
    async fetchAll(params) {
      const result = await get<UsersResponse>(`${endpoints.backoffice.users.list.href}?` + new URLSearchParams(params as Record<string, string>).toString());
      if (!result.success) {
        throw new Error('Failed to fetch users');
      }
      return result.data;
    },

    async getCurrentUser(apiOverride) {
      const uri = apiOverride ? apiOverride : endpoints
      if (!uri.backoffice) {
        return undefined
      }
      const result = await get<UserApiResponse>(uri.backoffice.users.me.href);
      if (!result.success) {
        return undefined;
      }
      return result.data;
    },

    async updateProfile(username, email, password, firstName, lastName, bio) {
      const result = await patch<UserApiResponse>(endpoints.backoffice.users.me.href, {
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
      const result = await patch(endpoints.backoffice.users.avatar.href, { avatarMediaId: id });
      if (!result.success) {
        throw new Error('Failed to complete upload');
      }
    },

    async remove(id: number) {
      const result = await remove(endpoints.backoffice.users.delete.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error('Failed to delete user');
      }
    },

    async deactivate(id: number) {
      const result = await post(endpoints.backoffice.users.deactivate.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error('Failed to deactivate account');
      }
    },

  }), [endpoints, get, patch, remove, post]);
}
