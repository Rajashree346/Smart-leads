import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
    name: string;
    email: string;
    status: "New" | "Contacted" | "Qualified" | "Lost";
    source: "Website" | "Instagram" | "Referral";
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
        },
        status: {
            type: String,
            enum: {
                values: ["New", "Contacted", "Qualified", "Lost"],
                message: "Status must be New, Contacted, Qualified, or Lost",
            },
            default: "New",
        },
        source: {
            type: String,
            enum: {
                values: ["Website", "Instagram", "Referral"],
                message: "Source must be Website, Instagram, or Referral",
            },
            required: [true, "Source is required"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model<ILead>("Lead", LeadSchema);
