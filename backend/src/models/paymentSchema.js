import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
        },
        plan: {
            type: String,
            enum: ['free', 'pro', 'premium'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
        },
        razorpayPaymentId: {
            type: String,
        },
        razorpaySignature: {
            type: String,
            default: null, // useful for verification and logs
        },
        receiptId: {
            type: String,
            default: null, // optional, used for custom tracking
        },
    },
    { timestamps: true }
);

export const Payment = model('Payment', paymentSchema);
