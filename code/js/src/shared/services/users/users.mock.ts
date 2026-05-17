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
    userId: '1',
    username: 'johndoe',
    email: 'johndoe@test.pt',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    profilePictureURL: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
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
    }
  }), []);
}
