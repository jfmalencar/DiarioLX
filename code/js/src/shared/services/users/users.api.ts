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
        throw new Error(result.error || 'Failed to fetch users');
      }
      return result.data;
    },

    async getCurrentUser() {
      const result = await get<UserApiResponse>(endpoints.auth?.me?.href);
      if (!result.success) {
        return undefined;
      }
      return result.data;
    },

    async updateProfile(username, email, password, firstName, lastName, bio, position, onTeam) {
      const result = await patch<UserApiResponse>(endpoints.auth.me.href, {
        username: username || null,
        email: email || null,
        password: password || null,
        firstName: firstName || null,
        lastName: lastName || null,
        bio: bio || null,
        position: position ?? null,
        onTeam: onTeam ?? null,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }
      return true;
    },

    async setOnTeam(id, onTeam) {
      const result = await patch(endpoints.backoffice.users.setTeam.href.replace('{id}', id.toString()), { onTeam });
      if (!result.success) {
        throw new Error(result.error || 'Failed to update team membership');
      }
    },

    async completeAvatarUpload(id) {
      const result = await patch(endpoints.backoffice.users.avatar.href, { avatarMediaId: id });
      if (!result.success) {
        throw new Error(result.error || 'Failed to complete upload');
      }
    },

    async remove(id: number) {
      const result = await remove(endpoints.backoffice.users.delete.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete user');
      }
    },

    async deactivate(id: number) {
      const result = await post(`${endpoints.backoffice.users.status.href.replace('{id}', id.toString())}?isActive=false`, {});
      if (!result.success) {
        throw new Error(result.error || 'Failed to deactivate account');
      }
    },

    async activate(id: number) {
      const result = await post(endpoints.backoffice.users.status.href.replace('{id}', id.toString()), {});
      if (!result.success) {
        throw new Error(result.error || 'Failed to activate account');
      }
    },

  }), [endpoints, get, patch, remove, post]);
}
