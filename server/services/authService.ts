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

export async function login(
  username: string,
  password: string
) {
  const user =
    findByUsername(username);

  if (!user) {
    return {
      success: false,
      message:
        "Invalid username or password.",
    };
  }

  const passwordMatches =
    await verifyPassword(
      password,
      user.passwordHash
    );

  if (!passwordMatches) {
    return {
      success: false,
      message:
        "Invalid username or password.",
    };
  }

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