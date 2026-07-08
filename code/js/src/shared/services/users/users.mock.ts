import { useMemo } from 'react';
import type { UsersService, User } from './users.types';

let fakeUser: User | undefined = undefined;

export const setFakeUser = (user: User | undefined) => {
  fakeUser = user;
  if (user) {
    cookieStore.set('authUser', JSON.stringify(user));
  } else {
    cookieStore.delete('authUser');
  }
}

const fakeUsers: User[] = [
  {
    userId: 1,
    username: 'johndoe',
    email: 'johndoe@test.pt',
    firstName: 'John',
    lastName: 'Doe',
    position: 'Editor',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    onTeam: false,
    profilePicturePath: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    features: ['manage-categories', 'manage-tags']
  }
]

export const useUsersMockService = (): UsersService => {
  return useMemo<UsersService>(() => ({

    async fetchAll() {
      return {
        items: fakeUsers,
        pagination: {
          page: 1,
          size: 1,
          hasPrevious: false,
          hasNext: false,
        }
      };
    },

    async getCurrentUser() {
      const result = await cookieStore.get('authUser')
      fakeUser = result ? JSON.parse(result.value as string) : undefined;
      return fakeUser;
    },

    async updateProfile() {
      return undefined;
    },

    async setOnTeam() {
      return;
    },

    async updateRole() {
      return;
    },

    async completeAvatarUpload() {
      return;
    },

    async deactivate() {
      return;
    },

    async activate() {
      return;
    },

    async remove() {
      return;
    },

    
    async getAllResetRequests() {
      return {
        items: [],
        pagination: {
          page: 1,
          size: 1,
          hasPrevious: false,
          hasNext: false,
        }
      };
    },

    async getResetRequestById(id: number) {
      return {
        id: 1,
        requesterId: 1,
        status: 'PENDING',
        requesterUsername: 'johndoe',
        requesterEmail: 'johndoe@test.pt',
        requesterName: 'John Doe',
        adminId: null,
        adminUsername: null,
        adminName: null,
        resetToken: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },

    async approveResetRequest(id: number) {
      return;
    },

    async rejectResetRequest(id: number) {
      return;
    },
  }), []);
}

