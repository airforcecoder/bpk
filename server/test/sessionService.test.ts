import { describe, expect, it } from "vitest";
import {
  createSession,
  getSessionUser,
  removeSession,
} from "../services/sessionService";

describe("Session Service", () => {
  it("creates a session", () => {
    createSession("test-session", 1);

    expect(
      getSessionUser("test-session")
    ).toBe(1);
  });

  it("removes a session", () => {
    createSession("test-session", 1);

    removeSession("test-session");

    expect(
      getSessionUser("test-session")
    ).toBeUndefined();
  });
});