import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = err;

    // Log for dev
    if (process.env.NODE_ENV !== "production") {
        if (err instanceof ApiError) {
            console.error(`[ApiError] ${err.statusCode} - ${err.message}`);
        } else {
            console.error(err);
        }
    }

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found`;
        error = new ApiError(404, message);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ApiError(400, message);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val: any) => val.message).join(", ");
        error = new ApiError(400, message);
    }

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode ? error.statusCode : 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
        statusCode: error.statusCode,
        success: error.success,
        message: error.message,
        ...(error.errors?.length > 0 && { errors: error.errors })
    };

    return res.status(error.statusCode).json(response);
};
