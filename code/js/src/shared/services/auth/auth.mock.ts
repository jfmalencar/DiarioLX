import type { AuthService } from './auth.types';

let fakeUser: string | undefined;

export const authMockService: AuthService = {
  async authenticate(username, password) {
    if (password === "test") {
      fakeUser = username;
      cookieStore.set('authToken', username);
      return username;
    }
    return undefined;
  },

  async logout() {
    fakeUser = undefined;
    cookieStore.delete('authToken');
  },

  async register(username) {
    fakeUser = username;
    return username;
  },

  async getCurrentUser() {
    const result = await cookieStore.get('authToken')
    fakeUser = result ? 'testuser' : undefined;
    return fakeUser;
  },
};
