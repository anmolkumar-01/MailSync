import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

import { Organization } from "../models/organizationSchema.js";
import { Payment } from "../models/paymentSchema.js"
import { OrgMember } from "../models/orgMemberSchema.js";
import crypto from "crypto";

// 1. Razorpay Signature Verification & Org Creation
const verify = asyncHandler(async (req, res) => {

    // 1. Take input
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orgInfo // contains name, email, owner (sent from frontend)
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orgInfo) {
        throw new ApiError(400, "Incomplete payment verification data.");
    }

  // 2. Generate expected signature using secret key
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = shasum.digest("hex");

    if (expectedSignature !== razorpay_signature) {
        throw new ApiError(400, "Payment signature verification failed.");
    }

    // 3. Fetch pending payment entry
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (!payment || payment.paymentStatus !== "pending") {
        throw new ApiError(404, "Payment not found or already processed.");
    }

    // 4. Create the organization (approved immediately for paid tiers)
    const tierLimits = { pro: 250, premium: 500 };
    const dailyLimit = tierLimits[payment.plan];

    const organization = await Organization.create({
        name: orgInfo.name,
        email: orgInfo.email,
        owner: orgInfo.owner,
        tier: payment.plan,
        dailyLimit,
        status: "approved"
    });

    // 5. Update payment record
    payment.paymentStatus = "completed";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.organizationId = organization._id;
    await payment.save();

    // 6. Create the current org member as the owner
    const orgMember = await OrgMember.create({
        userId: organization.owner,
        organization: organization._id,
        role: "orgAdmin",
        status: "accepted", 
    });

    // console.log("Orgmember created after payment: ", orgMember)

    return res.status(200).json(
        new ApiResponse(200, { organization }, "Payment verified & organization created successfully.")
    );

});

// 2. Total Revenue
const adminTotalRevenue = asyncHandler( async( req, res) => {

    const result = await Payment.aggregate([
        { $match: { paymentStatus: 'completed' } }, // filter completed payments
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } } // sum amounts
    ]);

    // result will be something like: [{ _id: null, totalAmount: 12345 }]
    const amount =  result.length > 0 ? result[0].totalAmount : 0;

    return res.status(200).json(
        new ApiResponse(200, amount , "Amount successfully fetched")
    );
})

export {
    verify,
    adminTotalRevenue
}