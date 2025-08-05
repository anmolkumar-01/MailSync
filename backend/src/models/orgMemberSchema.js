import { Schema, model } from "mongoose";

const orgMemberSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        organization: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },
        role: {
            type: String,
            enum: ['orgMember', 'orgAdmin'],
            default: 'orgMember',
        },
        status: {
            type: String,
            enum: ['invited', 'accepted', 'rejected', 'left'],
        },
        lastActivityAt: {
            type: Date,
            default: Date.now
        }

    },
    { timestamps: true }
);

export const OrgMember = model('OrgMember', orgMemberSchema);
