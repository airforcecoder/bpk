import {afterEach, describe, expect, it, vi } from "vitest";
import {
  createSession,
  getSessionUser,
  removeSession,
} from "../services/sessionService";

describe("Session Service", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
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
  
  it("rejects expired sessions", () => {
    vi.useFakeTimers();
    createSession(
      "expired-session",
      1
    );

    vi.advanceTimersByTime(
      1000 * 60 * 60 + 1
    );

  expect(
    getSessionUser("expired-session")
  ).toBeUndefined();
  });
});