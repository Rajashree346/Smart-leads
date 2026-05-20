import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";
import { z } from "zod";

// Register Bearer Security scheme
const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

import {
  RegisterRequestSchema,
  LoginRequestSchema,
  UserResponseSchema,
  AuthResponseSchema
} from "../schemas/auth.schema";
import {
  LeadRequestSchema,
  LeadResponseSchema
} from "../schemas/lead.schema";

// Register Paths (Routes)

// POST /api/v1/auth/register
registry.registerPath({
  method: "post",
  path: "/api/v1/auth/register",
  summary: "Register a new user",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
      content: {
        "application/json": {
          schema: z.object({
            statusCode: z.number().openapi({ example: 201 }),
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: "User registered successfully" }),
            data: AuthResponseSchema,
          }),
        },
      },
    },
  },
});

// POST /api/v1/auth/login
registry.registerPath({
  method: "post",
  path: "/api/v1/auth/login",
  summary: "User login",
  tags: ["Authentication"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User logged in successfully",
      content: {
        "application/json": {
          schema: z.object({
            statusCode: z.number().openapi({ example: 200 }),
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: "User logged in successfully" }),
            data: AuthResponseSchema,
          }),
        },
      },
    },
  },
});

// GET /api/v1/auth/me
registry.registerPath({
  method: "get",
  path: "/api/v1/auth/me",
  summary: "Get current logged-in user details",
  tags: ["Authentication"],
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: "User details retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            statusCode: z.number().openapi({ example: 200 }),
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: "User details retrieved successfully" }),
            data: UserResponseSchema,
          }),
        },
      },
    },
  },
});

// POST /api/v1/auth/leads
registry.registerPath({
  method: "post",
  path: "/api/v1/auth/leads",
  summary: "Create a new lead",
  tags: ["Leads"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: LeadRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Lead created successfully",
      content: {
        "application/json": {
          schema: z.object({
            statusCode: z.number().openapi({ example: 201 }),
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: "Lead created successfully" }),
            data: LeadResponseSchema,
          }),
        },
      },
    },
  },
});

// GET /api/v1/auth/leads
registry.registerPath({
  method: "get",
  path: "/api/v1/auth/leads",
  summary: "Get all leads with search, filtering, and pagination",
  tags: ["Leads"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    query: z.object({
      status: z.enum(["New", "Contacted", "Qualified", "Lost"]).optional().openapi({ description: "Filter by status" }),
      source: z.enum(["Website", "Instagram", "Referral"]).optional().openapi({ description: "Filter by source" }),
      search: z.string().optional().openapi({ description: "Search by name or email" }),
      sort: z.enum(["Latest", "Oldest"]).optional().openapi({ description: "Sort order (Latest or Oldest)", default: "Latest" }),
      page: z.string().optional().openapi({ description: "Page number for pagination", default: "1" }),
      limit: z.string().optional().openapi({ description: "Number of records per page", default: "10" }),
    }),
  },
  responses: {
    200: {
      description: "Leads fetched successfully",
      content: {
        "application/json": {
          schema: z.object({
            statusCode: z.number().openapi({ example: 200 }),
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: "Leads fetched successfully" }),
            data: z.object({
              leads: z.array(LeadResponseSchema),
              pagination: z.object({
                totalCount: z.number().openapi({ example: 25 }),
                totalPages: z.number().openapi({ example: 3 }),
                page: z.number().openapi({ example: 1 }),
                limit: z.number().openapi({ example: 10 }),
                hasNextPage: z.boolean().openapi({ example: true }),
                hasPrevPage: z.boolean().openapi({ example: false }),
              }),
            }),
          }),
        },
      },
    },
  },
});

// PUT /api/v1/auth/leads/{id}
registry.registerPath({
  method: "put",
  path: "/api/v1/auth/leads/{id}",
  summary: "Update an existing lead",
  tags: ["Leads"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ description: "The ID of the lead to update" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: LeadRequestSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Lead updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            statusCode: z.number().openapi({ example: 200 }),
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: "Lead updated successfully" }),
            data: LeadResponseSchema,
          }),
        },
      },
    },
  },
});

// DELETE /api/v1/auth/leads/{id}
registry.registerPath({
  method: "delete",
  path: "/api/v1/auth/leads/{id}",
  summary: "Delete a lead",
  tags: ["Leads"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({ description: "The ID of the lead to delete" }),
    }),
  },
  responses: {
    200: {
      description: "Lead deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            statusCode: z.number().openapi({ example: 200 }),
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: "Lead deleted successfully" }),
            data: z.null(),
          }),
        },
      },
    },
  },
});

export const getOpenApiDocumentation = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Smart Lead Dashboard API Documentation",
      description: "API endpoints documentation for Smart Lead Dashboard Backend",
    },
    servers: [{ url: "/" }],
  });
};
