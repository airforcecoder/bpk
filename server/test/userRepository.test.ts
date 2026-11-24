import {
  describe,
  expect,
  it,
} from "vitest";
import {
  shouldCreateDevUser,
} from "../repositories/UserRepository";


describe(
  "Development Credentials",
  () => {
    it(
      "disables demo users in production",
      () => {
        process.env.NODE_ENV =
          "production";

        expect(
          shouldCreateDevUser()
        ).toBe(false);
      }
    );

    it(
      "allows demo users in development",
      () => {
        process.env.NODE_ENV =
          "development";

        expect(
          shouldCreateDevUser()
        ).toBe(true);
      }
    );
  }
);