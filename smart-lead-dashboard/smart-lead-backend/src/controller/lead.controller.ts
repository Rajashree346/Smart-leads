import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import * as leadService from "../service/lead.service";
import { LeadRequestSchema } from "../schemas/lead.schema";

const updateLeadSchema = LeadRequestSchema.partial();

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(401, "Not authorized");
    }

    const { status, source, search, sort, page, limit } = req.query;

    const params = {
        status: status as string | undefined,
        source: source as string | undefined,
        search: search as string | undefined,
        sort: sort as "Latest" | "Oldest" | undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
    };

    const data = await leadService.getLeads(String(req.user._id), params);

    res.status(200).json(new ApiResponse(200, data, "Leads fetched successfully"));
});

export const createLead = asyncHandler(async (req: Request, res: Response) => {
    const result = LeadRequestSchema.safeParse(req.body);
    if (!result.success) {
        throw new ApiError(400, "Validation Error", result.error.issues);
    }

    if (!req.user) {
        throw new ApiError(401, "Not authorized");
    }

    const lead = await leadService.createLead(result.data, String(req.user._id));

    res.status(201).json(new ApiResponse(201, lead, "Lead created successfully"));
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    
    const result = updateLeadSchema.safeParse(req.body);
    if (!result.success) {
        throw new ApiError(400, "Validation Error", result.error.issues);
    }

    if (!req.user) {
        throw new ApiError(401, "Not authorized");
    }

    const lead = await leadService.updateLead(id, result.data, String(req.user._id));

    res.status(200).json(new ApiResponse(200, lead, "Lead updated successfully"));
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!req.user) {
        throw new ApiError(401, "Not authorized");
    }

    await leadService.deleteLead(id, String(req.user._id));

    res.status(200).json(new ApiResponse(200, null, "Lead deleted successfully"));
});