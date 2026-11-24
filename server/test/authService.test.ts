import { beforeEach, describe, expect, it } from "vitest";
import { login, clearLoginAttempts } from "../services/authService";
import { users } from "../repositories/UserRepository";
import { hashPassword } from "../services/passwordService";

describe("Authentication Service", () => {
  beforeEach(() => {
    clearLoginAttempts();
  });
  it("logs in successfully with valid credentials", async () => {
    const result = await login(
      process.env.DEV_ADMIN_USERNAME!,
      process.env.DEV_ADMIN_PASSWORD!
    );

    expect(result.success).toBe(true);
    expect(result.message).toBe(
      "Login successful."
    );
  });

  it("rejects an invalid username", async () => {
    const result = await login(
      "fakeuser",
      process.env.DEV_ADMIN_PASSWORD!
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Invalid username or password."
    );
  });

  it("rejects an invalid password", async () => {
    const result = await login(
      process.env.DEV_ADMIN_USERNAME!,
      "wrongpassword"
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Invalid username or password."
    );
  });

  it("rejects inactive users", async () => {
    const inactiveUser = {
    id: 2,
    username: "inactive",
    email: "inactive@test.com",
    passwordHash: await hashPassword(
      process.env.DEV_ADMIN_PASSWORD!
    ),
    role: "ADMIN" as const,
    isActive: false,
    createdAt: new Date(),
  };

  users.push(inactiveUser);

  const result = await login(
    "inactive",
    process.env.DEV_ADMIN_PASSWORD!
  );

  expect(result.success)
    .toBe(false);

  expect(result.message)
    .toBe("Account is inactive.");
  });
  it("rejects non-admin users", async () => {
  const standardUser = {
    id: 3,
    username: "standard",
    email: "user@test.com",
    passwordHash: await hashPassword(
      process.env.DEV_ADMIN_PASSWORD!
    ),
    role: "USER" as const,
    isActive: true,
    createdAt: new Date(),
  };

  users.push(standardUser);

  const result = await login(
    "standard",
    process.env.DEV_ADMIN_PASSWORD!
  );

  expect(result.success)
    .toBe(false);

  expect(result.message)
    .toBe(
      "Administrator access required."
    );
  });
  it("rate limits repeated failed logins", async () => {
  for (let i = 0; i < 5; i++) {
    await login(
      process.env.DEV_ADMIN_USERNAME!,
      "wrongpassword"
    );
  }

  const result = await login(
    process.env.DEV_ADMIN_USERNAME!,
    "wrongpassword"
  );

  expect(result.success)
    .toBe(false);

  expect(result.message)
    .toBe(
      "Too many failed login attempts. Please try again later."
    );
});
});