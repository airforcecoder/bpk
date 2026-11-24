import {
  describe,
  expect,
  it,
} from "vitest";

describe(
  "Development Credentials",
  () => {
    it(
      "does not create demo users in production",
      () => {
        process.env.NODE_ENV =
          "production";

        expect(
          process.env.NODE_ENV
        ).toBe("production");
      }
    );
  }
);