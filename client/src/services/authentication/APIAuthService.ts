import type { LoginService } from "./auth.interface";
import type {
  LoginCredentials,
  LoginResult,
} from "./auth.types";

export class ApiAuthService implements LoginService {
  async login(
    credentials: LoginCredentials
  ): Promise<LoginResult> {
    try {
        const response = await fetch(
        "/api/auth/login",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
            message:
            data.message ??
            "Authentication failed.",
            };
        }

        return {
        success: true,
        message:
            data.message ??
            "Login successful.",
        };
    }
    catch {
        return {
            success: false,
            message:
              "Authentication service unavailable. Please try again later.",
        };
        }
    }
}
