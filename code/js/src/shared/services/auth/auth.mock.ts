import type { AuthService } from './auth.types';
import type { User } from './auth.types';

const fakeUserId = 1;
const fakeLoginResponse = {
  token: 'fake-token',
  expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  message: 'Login successful',
}
let fakeUser: User | undefined = undefined;

export const authMockService: AuthService = {
  async authenticate(username, password) {
    if (password === "test") {
      fakeUser = {
        id: 1,
        username,
        email: `${username}@diariqlx.pt`,
        firstName: 'Test',
        lastName: 'User',
        bio: 'Test user bio',
        profilePictureUrl: 'https://placehold.co/213x213',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };
      cookieStore.set('authUser', JSON.stringify(fakeUser));
      return fakeLoginResponse;
    }
    return undefined;
  },

  async logout() {
    cookieStore.delete('authUser');
    fakeUser = undefined;
  },

  async register(username, email, _password, firstName, lastName) {
    fakeUser = {
      id: 1,
      username,
      email,
      firstName,
      lastName,
      bio: '',
      profilePictureUrl: 'https://placehold.co/213x213',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };
    return { userId: fakeUserId };
  },

  async getCurrentUser() {
    const result = await cookieStore.get('authUser')
    fakeUser = result ? JSON.parse(result.value as string) : undefined;
    return fakeUser;
  },

  async updateProfile() {
    return undefined;
  }
};
