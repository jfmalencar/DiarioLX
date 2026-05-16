import type { UsersService, User } from './users.types';

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
  }
]

export const usersMockService: UsersService = {
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
};
