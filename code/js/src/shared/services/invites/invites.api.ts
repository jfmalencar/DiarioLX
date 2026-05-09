import type { InviteRequest, InvitesService, InvitesResponse } from './invites.types';
import { get, post, remove } from '../http/client';

export const invitesApiService: InvitesService = {

  async fetchAll(params) {
    const result = await get<InvitesResponse>('/api/invites?' + new URLSearchParams(params as Record<string, string>).toString());
    if (!result.success) {
      throw new Error('Failed to fetch invites');
    }
    return result.data;
  },

  async create(invite) {
    const request: InviteRequest = {
      role: invite.role
    }
    const result = await post<string>('/api/invites', request);
    if (!result.success) {
      throw new Error('Failed to create invite');
    }
    return result.data;
  },

  async delete(id) {
    const result = await remove(`/api/invites/${id}`, {});
    if (!result.success) {
      throw new Error('Failed to delete invite');
    }
  },
};
