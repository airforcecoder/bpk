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
      !credentials.usernameOrEmail.trim() ||
      !credentials.password
    ) {
      return {
        success: false,
        message: "Please provide all required fields.",
      };
    }

    // Demonstration only.
    // No real authentication or authorization occurs.
    return {
      success: false,
      message:
        "Demo mode: Authentication is not configured. No admin access was granted.",
    };
  }
}