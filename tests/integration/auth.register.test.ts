import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../app.ts";

const username = `test_${Date.now()}`;
const email = `${username}@example.com`;

describe("POST /auth/register", () => {
  it("returns 201 with tokens and the created user for valid data", async () => {
    const response = await request(app).post("/auth/register").send({
      username,
      email,
      password: "secret123",
      name: "Test User",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      user: {
        id: expect.any(Number),
        username,
        email,
        name: "Test User",
      },
    });
  });
});
