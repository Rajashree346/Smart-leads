import { z } from "zod";
import { registry } from "../docs/registry";

export const UserResponseSchema = registry.register(
  "UserResponse",
  z.object({
    _id: z.string().openapi({ example: "60c72b2f9b1d8b2c4c8b4567" }),
    name: z.string().openapi({ example: "John Doe" }),
    email: z.string().email().openapi({ example: "john.doe@example.com" }),
    createdAt: z.string().openapi({ example: "2026-05-20T10:00:00.000Z" }),
    updatedAt: z.string().openapi({ example: "2026-05-20T10:00:00.000Z" }),
  })
);

export const AuthResponseSchema = registry.register(
  "AuthResponse",
  z.object({
    user: UserResponseSchema,
    token: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
  })
);

export const RegisterRequestSchema = registry.register(
  "RegisterRequest",
  z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").openapi({ example: "John Doe" }),
    email: z.string().email("Invalid email address").openapi({ example: "john.doe@example.com" }),
    password: z.string().min(6, "Password must be at least 6 characters").openapi({ example: "securepassword123" }),
  })
);

export const LoginRequestSchema = registry.register(
  "LoginRequest",
  z.object({
    email: z.string().email("Invalid email address").openapi({ example: "john.doe@example.com" }),
    password: z.string().min(1, "Password is required").openapi({ example: "securepassword123" }),
  })
);
