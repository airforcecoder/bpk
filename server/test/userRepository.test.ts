import {afterEach,describe,expect,it,vi,} from "vitest";

describe("User Repository",() => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });
  it("does not create demo users in production",async () => {
  vi.stubEnv(
  "NODE_ENV",
  "production"
  );
  vi.resetModules();

  const module = await import("../repositories/UserRepository");
  expect(module.users).toEqual([]);
});
it("creates a demo user in development",async () => {
  vi.stubEnv(
  "NODE_ENV",
  "development"
  );
  vi.stubEnv(
  "DEV_ADMIN_USERNAME",
  "test-admin"
  );
  vi.stubEnv(
  "DEV_ADMIN_EMAIL",
  "test@test.com"
  );
  vi.stubEnv(
  "DEV_ADMIN_PASSWORD",
  "password123"
  );
  vi.resetModules();

  const module =
  await import("../repositories/UserRepository");

  expect(
  module.users.length).toBe(1);
  expect(
  module.users[0].username
  ).toBe("test-admin");
  });
});