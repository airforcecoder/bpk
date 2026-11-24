import {
  findByUsername,
} from "../repositories/UserRepository";
import {
  verifyPassword,
} from "./passwordService";
import crypto from "crypto";
import {
  createSession,
} from "./sessionService";

const loginAttempts = new Map<
  string,
  {
    count: number;
    firstAttempt: number;
  }
>();

function isRateLimited(
  username: string
): boolean {
  const attempts =
    loginAttempts.get(username);

  if (!attempts) {
    return false;
  }

  const windowMs =
    15 * 60 * 1000;

  if (
    Date.now() -
      attempts.firstAttempt >
    windowMs
  ) {
    loginAttempts.delete(
      username
    );

    return false;
  }

  return attempts.count >= 5;
}

function recordFailedAttempt(
  username: string
): void {
  const existing =
    loginAttempts.get(username);

  if (existing) {
    existing.count += 1;
    return;
  }

  loginAttempts.set(
    username,
    {
      count: 1,
      firstAttempt: Date.now(),
    }
  );
}

export async function login(
  username: string,
  password: string
) {
  if (
    isRateLimited(username)
  ) {
    return {
      success: false,
      message:
        "Too many failed login attempts. Please try again later.",
    };
  }
  
  const user =
    findByUsername(username);

  if (!user) {
    recordFailedAttempt(
      username
    );
    return {
      success: false,
      message:
        "Invalid username or password.",
    };
  }
  if (!user.isActive) {
    return {
      success: false,
      message:
        "Account is inactive.",
    };
  }

  if (user.role !== "ADMIN") {
    return {
      success: false,
      message:
        "Administrator access required.",
    };
  }


  const passwordMatches =
    await verifyPassword(
      password,
      user.passwordHash
    );

  if (!passwordMatches) {
    recordFailedAttempt(
      username
    );

    return {
      success: false,
      message:
        "Invalid username or password.",
    };
  }

  loginAttempts.delete(
    username
  );

  const sessionId =
  crypto.randomUUID();

  createSession(
    sessionId,
    user.id
  );

  return {
    success: true,
    message: "Login successful.",
    sessionId,
    userId: user.id,
  };
}
export function clearLoginAttempts() {
  loginAttempts.clear();
}