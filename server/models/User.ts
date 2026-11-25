export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "USER";
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}