import type { UsersService, UsersResponse } from './users.types';
import { get } from '../http/client';

export const usersApiService: UsersService = {

  async fetchAll(params) {
    const result = await get<UsersResponse>('/api/user/all?' + new URLSearchParams(params as Record<string, string>).toString());
    if (!result.success) {
      throw new Error('Failed to fetch users');
    }
    return result.data;
  },

};
