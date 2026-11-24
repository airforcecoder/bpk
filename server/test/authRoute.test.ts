import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

describe("POST /api/auth/login", () => {
  const app = createApp();

  it("returns 200 for valid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        usernameOrEmail: process.env.DEV_ADMIN_USERNAME!,
        password: process.env.DEV_ADMIN_PASSWORD!,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Login successful."
    );
  });

  it("returns 401 for invalid password", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        usernameOrEmail: process.env.DEV_ADMIN_USERNAME!,
        password: "wrongpassword",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("returns 401 for invalid username", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        usernameOrEmail: "not-admin",
        password: process.env.DEV_ADMIN_PASSWORD!,
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("returns 400 when username is missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        password: process.env.DEV_ADMIN_PASSWORD!,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("returns 400 when password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        usernameOrEmail: process.env.DEV_ADMIN_USERNAME!,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
  it("creates a session on successful login", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
    usernameOrEmail: process.env.DEV_ADMIN_USERNAME!,
    password: process.env.DEV_ADMIN_PASSWORD!,
    });
 
    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
  });
  
  it("allows access with a valid session", async () => {
  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      usernameOrEmail: process.env.DEV_ADMIN_USERNAME!,
      password: process.env.DEV_ADMIN_PASSWORD!,
    });

  const cookie =
    loginResponse.headers["set-cookie"];

  const sessionResponse = await request(app)
    .get("/api/auth/session")
    .set("Cookie", cookie);

  expect(sessionResponse.status)
    .toBe(200);

  expect(
    sessionResponse.body.authenticated
  ).toBe(true);
  });

  it("denies access without a session", async () => {
  const response = await request(app)
    .get("/api/auth/session");

  expect(response.status).toBe(401);

  expect(
    response.body.authenticated
  ).toBe(false);
  });

  it("invalidates the session on logout", async () => {
  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      usernameOrEmail: process.env.DEV_ADMIN_USERNAME!,
      password: process.env.DEV_ADMIN_PASSWORD!,
    });

  const cookie =
    loginResponse.headers["set-cookie"];

  await request(app)
    .post("/api/auth/logout")
    .set("Cookie", cookie);

  const sessionResponse = await request(app)
    .get("/api/auth/session")
    .set("Cookie", cookie);

  expect(sessionResponse.status)
    .toBe(401);
  });

  it("rejects a session after logout", async () => {
  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({
      usernameOrEmail: process.env.DEV_ADMIN_USERNAME!,
      password: process.env.DEV_ADMIN_PASSWORD!,
    });

  const cookie =
    loginResponse.headers["set-cookie"];

  await request(app)
    .post("/api/auth/logout")
    .set("Cookie", cookie);

  const response = await request(app)
    .get("/api/auth/session")
    .set("Cookie", cookie);

  expect(response.status).toBe(401);
  expect(
    response.body.authenticated
  ).toBe(false);
  });
});