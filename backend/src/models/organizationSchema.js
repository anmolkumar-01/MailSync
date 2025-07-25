import { Schema, model } from "mongoose";

const organizationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        dailyLimit: {
            type: Number,
            default: 25,
        },
        tier: {
            type: String,
            enum: ['free', 'pro', 'premium'],
            default: 'free',
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    {timestamps: true}
)

export const Organization = model('Organization', organizationSchema);