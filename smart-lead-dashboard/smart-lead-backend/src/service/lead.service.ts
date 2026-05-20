import Lead, { type ILead } from "../models/Lead";
import { ApiError } from "../utils/ApiError";

export interface GetLeadsParams {
    status?: string;
    source?: string;
    search?: string;
    sort?: "Latest" | "Oldest";
    page?: number;
    limit?: number;
}

export const getLeads = async (userId: string, params: GetLeadsParams) => {
    const { status, source, search, sort = "Latest", page = 1, limit = 10 } = params;

    // 1. Build Query Object
    const query: any = { userId };

    if (status) {
        query.status = status;
    }

    if (source) {
        query.source = source;
    }

    if (search) {
        // Search by name OR email (case-insensitive regex)
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    // 2. Count total matches for pagination metadata
    const totalCount = await Lead.countDocuments(query);

    // 3. Determine sorting
    let sortOptions: any = { createdAt: -1 }; // default to Latest
    if (sort === "Oldest") {
        sortOptions = { createdAt: 1 };
    }

    // 4. Calculate pagination fields
    const parsedPage = Math.max(1, page);
    const parsedLimit = Math.max(1, limit);
    const skip = (parsedPage - 1) * parsedLimit;

    // 5. Execute query
    const leads = await Lead.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parsedLimit);

    const totalPages = Math.ceil(totalCount / parsedLimit);

    return {
        leads,
        pagination: {
            totalCount,
            totalPages,
            page: parsedPage,
            limit: parsedLimit,
            hasNextPage: parsedPage < totalPages,
            hasPrevPage: parsedPage > 1,
        },
    };
};

export const createLead = async (leadData: Partial<ILead>, userId: string) => {
    const lead = await Lead.create({
        ...leadData,
        userId,
    });
    return lead;
};

export const updateLead = async (leadId: string, leadData: Partial<ILead>, userId: string) => {
    const lead = await Lead.findOne({ _id: leadId, userId });
    
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    Object.assign(lead, leadData);
    await lead.save();

    return lead;
};

export const deleteLead = async (leadId: string, userId: string) => {
    const lead = await Lead.findOne({ _id: leadId, userId });
    
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    await lead.deleteOne();
    return lead;
};
