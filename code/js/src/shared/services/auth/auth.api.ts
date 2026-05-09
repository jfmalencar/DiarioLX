import type { AuthService, LoginResponseDTO, RegisterResponseDTO, User, UserApiResponse } from './auth.types';
import { get, post, patch } from '../http/client';

export const authApiService: AuthService = {
  async authenticate(username, password) {
    const result = await post<LoginResponseDTO>('/api/auth/login', {
      username,
      password,
    });

    if (!result.success) {
      return undefined;
    }

    return result.data;
  },

  async logout() {
    await post('/api/auth/logout', {});
  },

  async register(username, email, password, firstName, lastName, inviteCode) {
    const result = await post<RegisterResponseDTO>(
      '/api/auth/signup',
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
    const result = await get<UserApiResponse>('/api/users/me');

    if (!result.success) {
      return undefined;
    }

    return normalizeUser(result.data);
  },

  async updateProfile(username, email, password, firstName, lastName, bio, profilePictureUrl) {
    const result = await patch<UserApiResponse>('/api/users/me', {
      username: username || null,
      email: email || null,
      password: password || null,
      fName: firstName || null,
      lName: lastName || null,
      bio: bio || null,
      profilePictureURL: profilePictureUrl || null,
    });

    if (!result.success) {
      return undefined;
    }

    return normalizeUser(result.data);
  },
};

// Helper function to transform API response to normalized User type
function normalizeUser(apiUser: UserApiResponse): User {
  const getDateString = (date: unknown): string => {
    if (typeof date === 'string') return date;
    if (date && typeof date === 'object' && 'value$kotlinx_datetime' in date) {
      return (date as { value$kotlinx_datetime: string }).value$kotlinx_datetime;
    }
    return new Date().toISOString();
  };

  return {
    id: apiUser.userId,
    username: apiUser.username,
    email: apiUser.email,
    firstName: apiUser.fName,
    lastName: apiUser.lName,
    bio: apiUser.bio || null,
    profilePictureUrl: apiUser.profilePictureURL || null,
    createdAt: getDateString(apiUser.createdAt),
    updatedAt: getDateString(apiUser.updatedAt),
    isActive: apiUser.isActive,
    role: apiUser.role,
  };
};