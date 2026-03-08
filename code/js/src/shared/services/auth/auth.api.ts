import type { AuthService } from './auth.types';
import { get, post } from '../http/client';

export const authApiService: AuthService = {
  async authenticate(username, password) {
    const result = await post<string>('/api/users/token', {
      username,
      password,
    });

    if (!result.success) {
      return undefined;
    }

    return username;
  },

  async logout() {
    await post('/api/users/logout', {});
  },

  async register(username, password) {
    const result = await post<string>('/api/users', {
      username,
      password,
    });

    if (!result.success) {
      return undefined;
    }

    return username;
  },

  async getCurrentUser() {
    const result = await get<any>('/api/me');

    if (!result.success) {
      return undefined;
    }

    return result.data;
  },
};