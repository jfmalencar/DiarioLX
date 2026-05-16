import type { UserRole } from '../users/users.types';

export interface AuthService {
  authenticate(username: string, password: string): Promise<LoginResponseDTO | undefined>;

  logout(): Promise<void>;

  register(
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    inviteCode: string
  ): Promise<boolean>;

  getCurrentUser(): Promise<User | undefined>;

  updateProfile(
    username?: string,
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    bio?: string | null,
    profilePictureUrl?: string | null
  ): Promise<User | undefined>;
}

// API response types
export type UserApiResponse = {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profilePictureURL: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role: UserRole;
};

// Normalized user type
export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profilePictureUrl: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role: UserRole;
};

export type LoginResponseDTO = {
  token: string;
  expiresAt: string;
  message: string;
}