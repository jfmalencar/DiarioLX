import type { AuthService } from './auth.types';

let fakeUser: string | undefined;

export const authMockService: AuthService = {
  async authenticate(username, password) {
    if (password === "test") {
      fakeUser = username;
      return username;
    }
    return undefined;
  },

  async logout() {
    fakeUser = undefined;
  },

  async register(username) {
    fakeUser = username;
    return username;
  },

  async getCurrentUser() {
    return fakeUser;
  },
};