import type { LoginCredentials } from "../services/authentication/auth.types";

export interface ValidationErrors {
  usernameOrEmail?: string;
  password?: string;
}

export function validateLogin(
  credentials: LoginCredentials
): ValidationErrors {
  const errors: ValidationErrors = {};

  const username = credentials.usernameOrEmail.trim();

  if (!username) {
    errors.usernameOrEmail =
      "Username or email is required.";
  } else if (
    username.includes("@") &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)
  ) {
    errors.usernameOrEmail =
      "Please enter a valid email address.";
  }

  if (!credentials.password) {
    errors.password = "Password is required.";
  }

  return errors;
}