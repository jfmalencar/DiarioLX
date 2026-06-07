import { useMemo } from 'react';

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { InviteRequest, InvitesService, InvitesResponse } from './invites.types';
import { useApi } from '../http/client';

export const useInvitesApiService = (): InvitesService => {
  const { get, post, remove } = useApi()
  const { endpoints } = useBootstrap()

  return useMemo<InvitesService>(() => ({
    async fetchAll(params) {
      const result = await get<InvitesResponse>(`${endpoints.backoffice.invites.list.href}?${new URLSearchParams(params as Record<string, string>)}`);
      if (!result.success) {
        throw new Error('Failed to fetch invites');
      }
      return result.data;
    },

    async create(invite) {
      const request: InviteRequest = {
        role: invite.role
      }
      const result = await post<string>(endpoints.backoffice.invites.create.href, request);
      if (!result.success) {
        throw new Error('Failed to create invite');
      }
      return result.data;
    },

    async delete(id) {
      const result = await remove(endpoints.backoffice.invites.delete.href.replace('{id}', id), {});
      if (!result.success) {
        throw new Error('Failed to delete invite');
      }
    },
  }), [get, post, remove, endpoints])
};
