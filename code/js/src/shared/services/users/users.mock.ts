import type { UsersService, User } from './users.types';

const fakeUsers: User[] = [
  {
    userId: '1',
    username: 'johndoe',
    email: 'johndoe@test.pt',
    fName: 'John',
    lName: 'Doe',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    profilePictureURL: 'https://randomuser.me/api/portraits/men/1.jpg',
  }
]

export const usersMockService: UsersService = {
  async fetchAll() {
    return {
      users: fakeUsers,
    };
  },
};
