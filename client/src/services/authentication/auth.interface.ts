import type {
  LoginCredentials,
  LoginResult,
} from "./auth.types";

export interface LoginService {
  login(
    credentials: LoginCredentials
  ): Promise<LoginResult>;
}