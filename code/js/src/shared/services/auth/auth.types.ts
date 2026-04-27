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
  ): Promise<RegisterResponseDTO | undefined>;

  getCurrentUser(): Promise<User | undefined>;
}

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profilePictureUrl: string | null;
};

export type LoginResponseDTO = {
  token: string;
  expiresAt: string;
  message: string;
}

export type RegisterResponseDTO = {
  userId: number;
}