import { z } from "zod";
import { registry } from "../docs/registry";

export const LeadRequestSchema = registry.register(
  "LeadRequest",
  z.object({
    name: z.string().min(1, "Name is required").openapi({ example: "Jane Smith" }),
    email: z.string().email("Invalid email address").openapi({ example: "jane.smith@example.com" }),
    status: z.enum(["New", "Contacted", "Qualified", "Lost"]).optional().openapi({ example: "New" }),
    source: z.enum(["Website", "Instagram", "Referral"]).openapi({ example: "Instagram" }),
  })
);

export const LeadResponseSchema = registry.register(
  "LeadResponse",
  z.object({
    _id: z.string().openapi({ example: "60c72b2f9b1d8b2c4c8b4568" }),
    name: z.string().openapi({ example: "Jane Smith" }),
    email: z.string().openapi({ example: "jane.smith@example.com" }),
    status: z.enum(["New", "Contacted", "Qualified", "Lost"]).openapi({ example: "New" }),
    source: z.enum(["Website", "Instagram", "Referral"]).openapi({ example: "Instagram" }),
    userId: z.string().openapi({ example: "60c72b2f9b1d8b2c4c8b4567" }),
    createdAt: z.string().openapi({ example: "2026-05-20T10:00:00.000Z" }),
    updatedAt: z.string().openapi({ example: "2026-05-20T10:00:00.000Z" }),
  })
);
