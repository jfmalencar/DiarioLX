import { useMemo } from 'react';

import type { InvitesService, Invite } from './invites.types';

const fakeInvites: Invite[] = [
  {
    id: 1,
    invite: 'abc123',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    used: false,
  }
]

export const useInvitesMockService = (): InvitesService => {
  return useMemo<InvitesService>(() => ({

    async fetchAll() {
      return {
        items: fakeInvites,
        pagination: {
          page: 1,
          size: 10,
          hasPrevious: false,
          hasNext: false,
        }
      };
    },

    async create(invite) {
      const newInvite = {
        id: fakeInvites.length > 0 ? Math.max(...fakeInvites.map((i) => i.id)) + 1 : 1,
        invite: 'invite_' + Math.random().toString(36).substr(2, 9),
        role: invite.role,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        used: false,
      };
      await new Promise((resolve) => setTimeout(resolve, 2000));
      fakeInvites.push(newInvite);
      return newInvite.invite;
    },

    async delete(id) {
      const index = fakeInvites.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error('Invite not found');
      }
      fakeInvites.splice(index, 1);
    },
  }), [])
}
