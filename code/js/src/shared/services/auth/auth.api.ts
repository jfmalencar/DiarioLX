import type { AuthService, LoginResponseDTO, User, UserApiResponse } from './auth.types';
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
    const result = await post<undefined>(
      '/api/auth/signup',
      {
        username,
        email,
        password,
        firstName: firstName,
        lastName: lastName,
      },
      {
        headers: {
          Authorization: `Invite ${inviteCode}`,
        },
      }
    );
    if (!result.success) {
      return false
    }
    return true;
  },

  async getCurrentUser() {
    const result = await get<UserApiResponse>('/api/users/me');

    if (!result.success) {
      return undefined;
    }

    console.log(result.data)

    return normalizeUser(result.data);
  },

  async updateProfile(username, email, password, firstName, lastName, bio, profilePictureUrl) {
    const result = await patch<UserApiResponse>('/api/users/me', {
      username: username || null,
      email: email || null,
      password: password || null,
      firstName: firstName || null,
      lastName: lastName || null,
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
  return {
    id: apiUser.userId,
    username: apiUser.username,
    email: apiUser.email,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    bio: apiUser.bio || null,
    profilePictureUrl: apiUser.profilePictureURL || null,
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
    isActive: apiUser.isActive,
    role: apiUser.role,
  };
};