import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import User, { type IUser } from "../models/User";

// Extend Express Request object to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    // Standardize path ignoring query parameters
    const path = (req.originalUrl || req.path || "").split("?")[0] || "";
    
    // Define routes that bypass token verification (e.g. login & register)
    const excludedPaths = [
        "/api/v1/auth/login",
        "/api/v1/auth/register"
    ];

    if (excludedPaths.includes(path) || path.startsWith("/api/v1/docs")) {
        return next();
    }

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ApiError(401, "Not authorized, no token provided"));
    }

    try {
        // Verify token
        const decoded = verifyToken(token);

        // Fetch user and attach to request
        const user = await User.findById(decoded._id).select("-password");
        
        if (!user) {
            return next(new ApiError(401, "Not authorized, user not found"));
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(401, "Not authorized, token failed"));
    }
};
