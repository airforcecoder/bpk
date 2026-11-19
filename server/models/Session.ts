export interface Session {
  id: string;
  userId: number;
  createdAt: Date;
  expiresAt: Date;
}