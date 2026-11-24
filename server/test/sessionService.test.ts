import { describe, expect, it } from "vitest";
import {
  createSession,
  getSessionUser,
  removeSession,
} from "../services/sessionService";
import type { Session }
from "../models/Session";

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
  
  it("rejects expired sessions", () => {
  const sessionId =
    "expired-session";

  const sessions =
    new Map<string, Session>();

  sessions.set(sessionId, {
    id: sessionId,
    userId: 1,
    createdAt: new Date(),
    expiresAt: new Date(
      Date.now() - 1000
    ),
  });

  expect(
    getSessionUser(sessionId)
  ).toBeUndefined();
  });
});