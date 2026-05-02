import type { AuthService } from './auth.types';
import type { User } from './auth.types';

let fakeUserId = 1;
let fakeUser: User | undefined = undefined;
let fakeLoginResponse = {
  token: 'fake-token',
  expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  message: 'Login successful',
}

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
      return fakeLoginResponse;
    }
    return undefined;
  },

  async logout() {
    fakeUser = undefined;
  },

  async register(username, email, _password, firstName, lastName, _inviteCode) {
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
    const result = await cookieStore.get('authToken')
    fakeUser = result ? fakeUser : undefined;
    return fakeUser;
  },
};
