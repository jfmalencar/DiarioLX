import type { AuthService, LoginResponseDTO, RegisterResponseDTO, User } from './auth.types';
import { get, post } from '../http/client';

export const authApiService: AuthService = {
  async authenticate(username, password) {
    const result = await post<LoginResponseDTO>('/api/user/login', {
      username,
      password,
    });

    if (!result.success) {
      return undefined;
    }

    return result.data;
  },

  async logout() {
    await post('/api/user/logout', {});
  },

  async register(username, email, password, firstName, lastName, inviteCode) {
    const result = await post<RegisterResponseDTO>(
      '/api/user/signup',
      {
        username,
        email,
        password,
        fName: firstName,
        lName: lastName,
      },
      {
        headers: {
          Authorization: `Invite ${inviteCode}`,
        },
      }
    );

    if (!result.success) {
      return undefined;
    }

    return result.data;
  },

  async getCurrentUser() {
    const result = await get<User>('/api/user/me');

    if (!result.success) {
      return undefined;
    }

    return result.data;
  },
};