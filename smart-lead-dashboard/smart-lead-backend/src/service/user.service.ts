import User from "../models/User";
import { ApiError } from "../utils/ApiError";
import { generateToken } from "../utils/jwt";

export const registerUser = async (name: string, email: string, password: string) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    // Generate token
    const token = generateToken({
        _id: String(user._id),
        name: user.name,
        email: user.email
    });

    return { user, token };
};

export const loginUser = async (email: string, password: string) => {
    // Find user and explicitly select password since it might be needed for comparison
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate token
    const token = generateToken({
        _id: String(user._id),
        name: user.name,
        email: user.email
    });

    // Remove password from returned user object
    const userObj = user.toJSON();

    return { user: userObj, token };
};
