import jwt from "jsonwebtoken";

const JWT_SECRET = Bun.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = Bun.env.JWT_EXPIRES_IN || "7d";

export interface TokenPayload {
    _id: string;
    name: string;
    email: string;
}

export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};
