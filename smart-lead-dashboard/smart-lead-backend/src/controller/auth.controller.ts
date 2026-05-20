import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import * as userService from "../service/user.service";
import { RegisterRequestSchema, LoginRequestSchema } from "../schemas/auth.schema";

export const register = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const result = RegisterRequestSchema.safeParse(req.body);
    if (!result.success) {
        throw new ApiError(400, "Validation Error", result.error.issues);
    }

    const { name, email, password } = result.data;

    // Call service layer
    const { user, token } = await userService.registerUser(name, email, password);

    // Send response
    res.status(201).json(
        new ApiResponse(201, { user, token }, "User registered successfully")
    );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const result = LoginRequestSchema.safeParse(req.body);
    if (!result.success) {
        throw new ApiError(400, "Validation Error", result.error.issues);
    }

    const { email, password } = result.data;

    // Call service layer
    const { user, token } = await userService.loginUser(email, password);

    // Send response
    res.status(200).json(
        new ApiResponse(200, { user, token }, "User logged in successfully")
    );
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(401, "Not authorized");
    }

    res.status(200).json(
        new ApiResponse(200, req.user, "User details retrieved successfully")
    );
});
