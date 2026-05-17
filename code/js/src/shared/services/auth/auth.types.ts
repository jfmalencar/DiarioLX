export type LoginResponseDTO = {
  token: string;
  expiresAt: string;
  message: string;
}

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

}
