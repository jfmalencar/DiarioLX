export interface AuthService {
  authenticate(username: string, password: string): Promise<string | undefined>;

  logout(): Promise<void>;

  register(
    username: string,
    password: string,
  ): Promise<string | undefined>;

  getCurrentUser(): Promise<any>;
}