import { describe, expect, it } from "vitest";
import { login } from "../services/authService";

describe("Authentication Service", () => {
  it("logs in successfully with valid credentials", async () => {
    const result = await login(
      "admin",
      "password123"
    );

    expect(result.success).toBe(true);
    expect(result.message).toBe(
      "Login successful."
    );
  });

  it("rejects an invalid username", async () => {
    const result = await login(
      "fakeuser",
      "password123"
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Invalid username or password."
    );
  });

  it("rejects an invalid password", async () => {
    const result = await login(
      "admin",
      "wrongpassword"
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Invalid username or password."
    );
  });
});