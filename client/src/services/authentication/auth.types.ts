export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  message: string;
}