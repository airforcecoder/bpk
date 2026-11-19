import type { User } from "../models/User";
import { hashPassword } from "../services/passwordService";

const ADMIN_PASSWORD_HASH =
  await hashPassword("password123");

export const users: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    passwordHash: ADMIN_PASSWORD_HASH,
    role: "ADMIN",
    isActive: true,
    createdAt: new Date(),
  },
];

export function findByUsername(
  username: string
): User | undefined {
  return users.find(
    (user) => user.username === username
  );
}