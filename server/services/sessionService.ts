const sessions = new Map<
  string,
  number
>();

export function createSession(
  sessionId: string,
  userId: number
): void {
  sessions.set(sessionId, userId);
}

export function getSessionUser(
  sessionId: string
): number | undefined {
  return sessions.get(sessionId);
}

export function removeSession(
  sessionId: string
): void {
  sessions.delete(sessionId);
}