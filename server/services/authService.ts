import {
  findByUsername,
} from "../repositories/UserRepository";
import {
  verifyPassword,
} from "./passwordService";

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

  return {
    success: true,
    message:
      "Login successful.",
    userId: user.id,
  };
}