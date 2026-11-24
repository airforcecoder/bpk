import type { User } from "../models/User";
import { hashPassword } from "../services/passwordService";

const DEV_ADMIN_USERNAME =
  process.env.DEV_ADMIN_USERNAME
  ?? "admin";

const DEV_ADMIN_EMAIL =
  process.env.DEV_ADMIN_EMAIL ??
  "admin@example.com";

const DEV_ADMIN_PASSWORD =
  process.env.DEV_ADMIN_PASSWORD
  ?? "password123";

const ADMIN_PASSWORD_HASH =
  await hashPassword(
    DEV_ADMIN_PASSWORD
  );

export const users: User[] = [
  {
    id: 1,
    username: DEV_ADMIN_USERNAME,
    email: DEV_ADMIN_EMAIL,
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