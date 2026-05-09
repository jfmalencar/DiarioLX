import type { InvitesService, Invite } from './invites.types';

const fakeInvites: Invite[] = [
  {
    invite: 'abc123',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    used: false,
  }
]

export const invitesMockService: InvitesService = {
  async fetchAll() {
    return {
      invites: fakeInvites,
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
    const index = fakeInvites.findIndex((t) => t.invite === id);
    if (index === -1) {
      throw new Error('Invite not found');
    }
    fakeInvites.splice(index, 1);
  },
}
