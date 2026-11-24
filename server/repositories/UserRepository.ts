import type { User } from "../models/User";
import { hashPassword } from "../services/passwordService";
import "dotenv/config";

const ALLOW_DEV_ACCOUNT =
  process.env.NODE_ENV === "development"||
  process.env.NODE_ENV === "test";
  
const DEV_ADMIN_USERNAME =
  process.env.DEV_ADMIN_USERNAME;

const DEV_ADMIN_EMAIL =
  process.env.DEV_ADMIN_EMAIL;

const DEV_ADMIN_PASSWORD =
  process.env.DEV_ADMIN_PASSWORD;

if (
  ALLOW_DEV_ACCOUNT &&
  (
    !DEV_ADMIN_USERNAME ||
    !DEV_ADMIN_EMAIL ||
    !DEV_ADMIN_PASSWORD
  )
) {
  throw new Error(
    "Development admin credentials are missing. Check your .env file."
  );
}

export const users: User[] =
  ALLOW_DEV_ACCOUNT &&
  DEV_ADMIN_USERNAME &&
  DEV_ADMIN_EMAIL &&
  DEV_ADMIN_PASSWORD
    ? [
        {
          id: 1,
          username: DEV_ADMIN_USERNAME,
          email: DEV_ADMIN_EMAIL,
          passwordHash: await hashPassword(
            DEV_ADMIN_PASSWORD
          ),
          role: "ADMIN",
          isActive: true,
          createdAt: new Date(),
        },
      ]
    : [];

export function findByUsername(
  username: string
): User | undefined {
  return users.find(
    (user) => user.username === username
  );
}
export function shouldCreateDevUser() {
  return process.env.NODE_ENV === "development";
}