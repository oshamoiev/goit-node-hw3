import { registry } from "../openapi.ts";
import { LoginSchema, RefreshSchema, RegisterSchema } from "../validators/auth.validator.ts";

registry.registerPath({
  method: "post",
  path: "/auth/register",
  tags: ["Auth"],
  summary: "Register a new user",
  request: {
    body: {
      content: {
        "application/json": { schema: RegisterSchema },
      },
    },
  },
  responses: {
    201: { description: "User registered successfully" },
    409: { description: "Username or email already taken" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  tags: ["Auth"],
  summary: "Login user",
  request: {
    body: {
      content: {
        "application/json": { schema: LoginSchema },
      },
    },
  },
  responses: {
    200: { description: "Login successful" },
    401: { description: "Invalid credentials" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/refresh",
  tags: ["Auth"],
  summary: "Refresh token pair",
  request: {
    body: {
      content: {
        "application/json": { schema: RefreshSchema },
      },
    },
  },
  responses: {
    200: { description: "Tokens refreshed successfully" },
    401: { description: "Invalid or expired refresh token" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/logout",
  tags: ["Auth"],
  summary: "Logout current session",
  security: [{ bearerAuth: [] }],
  responses: {
    204: { description: "Logged out successfully" },
  },
});

registry.registerPath({
  method: "get",
  path: "/auth/me",
  tags: ["Auth"],
  summary: "Get current user profile",
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "Current user profile" },
    401: { description: "Authentication required" },
  },
});
