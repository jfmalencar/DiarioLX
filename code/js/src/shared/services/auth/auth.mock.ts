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
      return fakeLoginResponse;
    }
    return undefined;
  },

  async logout() {
    fakeUser = undefined;
  },

  async register(username, email, _password, firstName, lastName, _inviteCode) {
    fakeUser = { id: 1, username, email, firstName, lastName, bio: '', profilePictureUrl: '' };
    return { userId: fakeUserId };
  },

  async getCurrentUser() {
    const result = await cookieStore.get('authToken')
    fakeUser = result ? fakeUser : undefined;
    return fakeUser;
  },
};
