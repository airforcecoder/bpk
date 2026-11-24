import type { User } from "../models/User";
import { hashPassword } from "../services/passwordService";
import "dotenv/config";

const IS_DEVELOPMENT =
  process.env.NODE_ENV !== "production";

const DEV_ADMIN_USERNAME =
  process.env.DEV_ADMIN_USERNAME;

const DEV_ADMIN_EMAIL =
  process.env.DEV_ADMIN_EMAIL;

const DEV_ADMIN_PASSWORD =
  process.env.DEV_ADMIN_PASSWORD;

console.log("NODE_ENV =", process.env.NODE_ENV);
console.log(
  "DEV_ADMIN_USERNAME =",
  process.env.DEV_ADMIN_USERNAME
);
console.log(
  "DEV_ADMIN_EMAIL =",
  process.env.DEV_ADMIN_EMAIL
);
console.log(
  "DEV_ADMIN_PASSWORD =",
  process.env.DEV_ADMIN_PASSWORD
);

if (
  IS_DEVELOPMENT &&
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
  IS_DEVELOPMENT &&
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