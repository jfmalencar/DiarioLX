export interface AuthService {
  authenticate(username: string, password: string): Promise<boolean | undefined>;

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
