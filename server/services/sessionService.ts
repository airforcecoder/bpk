import type { Session }
from "../models/Session";

const sessions = new Map<
  string,
  Session
>();

export function createSession(
  sessionId: string,
  userId: number
): void {
  const expiresAt =
    new Date(
      Date.now() +
      1000 * 60 * 60
    ); // 1 hour

  sessions.set(
    sessionId,
    {
      id: sessionId,
      userId,
      createdAt: new Date(),
      expiresAt,
    }
  );
}

export function getSessionUser(
  sessionId: string | undefined
): number | undefined {
  if (!sessionId) {
    return undefined;
  }
  
  const session =
    sessions.get(sessionId);

  if (!session) {
    return undefined;
  }

  if (
    session.expiresAt.getTime() <
    Date.now()
  ) {
    sessions.delete(sessionId);

    return undefined;
  }

  return session.userId;
}

export function removeSession(
  sessionId: string
): void {
  sessions.delete(sessionId);
}