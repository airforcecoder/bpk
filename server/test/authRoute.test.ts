import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app";

describe("POST /api/auth/login", () => {
  const app = createApp();

  it("returns 200 for valid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        usernameOrEmail: "admin",
        password: "password123",
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
        usernameOrEmail: "admin",
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
        password: "password123",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("returns 400 when username is missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        password: "password123",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("returns 400 when password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        usernameOrEmail: "admin",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});