import type { LoginService } from "./auth.interface";
import type {
  LoginCredentials,
  LoginResult,
} from "./auth.types";

export class MockAuthService implements LoginService {
  async login(
    credentials: LoginCredentials
  ): Promise<LoginResult> {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    if (
  credentials.usernameOrEmail === "admin" &&
  credentials.password === "password123"
) {
  return {
    success: true,
    message: "Demo login successful.",
  };
}

return {
    success: false,
    message: "Demo login failed. This is a UI-only implementation.",
    };
  }
}