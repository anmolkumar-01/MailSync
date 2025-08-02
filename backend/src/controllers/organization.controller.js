import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Organization } from "../models/organizationSchema.js";
import { Payment } from "../models/paymentSchema.js"
import Razorpay from "razorpay";
import { OrgMember } from "../models/orgMemberSchema.js";

// 1. Create Organization
const createOrg = asyncHandler(async (req, res) => {

    // 1. Take input
    const { name, email, tier, description } = req.body;
    const owner = req.user._id;
    if (!name || !email || !tier) {
        throw new ApiError(400, "All fields are required.");
    }
    // console.log(req.body)

    // 2. Check if organization with same email already exists
    const existingOrg = await Organization.findOne({ email });
    if (existingOrg) {
        throw new ApiError(400, "An Organization is associated with this email. Please select another email");
    }

    // 3. Valid tier check and daily limit mapping
    const tierLimits = {
        free: 25,
        pro: 250,
        premium: 500
    };

    if (!tierLimits[tier]) {
        throw new ApiError(400, "Invalid tier selected.");
    }

    // 4. Handle Free Tier (no payment needed)
    if (tier === "free") {
        const organization = await Organization.create({
            name,
            email,
            owner,
            description,
            tier,
            dailyLimit: tierLimits[tier],
            status: "pending"  // Requires admin approval
        });

        await OrgMember.create({
            userId: owner._id,
            organization: organization._id,
            role: "orgAdmin",
            status: "accepted", 
        })

        console.log("Paid organization ", organization);
        return res.status(201).json(
            new ApiResponse(201, organization, "Organization created with free tier. Awaiting admin approval.")
        );
    }

    // 5. Handle Paid Tiers (pro, premium)
    const amount = tier === "pro" ? 19900 : 39900; // ₹199 or ₹399
    const {order, paymentId} = await initiatePayment({
        userId: owner,
        tier,
        amount
    });

    // console.log("paymentid: " , paymentId)
    // console.log("order: " , order)

    return res.status(200).json(
        new ApiResponse(200, {
            razorpayOrder: order,
            paymentId,
            tier,
            amount,
            orgInfo: {
                name,
                email,
                owner
            }
        }, "Payment initiated successfully. Proceed to checkout.")
    );
})

// 2. Update Organization by id
const updateOrg = asyncHandler(async (req, res) => {

    // 1. Take input
    const { orgId } = req.params;
    const { name, description} = req.body;

    if(!name || !orgId){
        throw new ApiError(400, "All fields are required");
    }

    // 2. update organization
    const org = await Organization.findByIdAndUpdate(
        orgId,
        { 
            name,
            description,
        },
        { new: true }
    );

    if (!org) {
        throw new ApiError(404, "Organization not found");
    }

    res.status(200).json(new ApiResponse(200,  org, "Organization updated successfully"));
})

// 3. Delete Organization by id
const deleteOrg = asyncHandler(async (req, res) => {
    const { orgId } = req.params;

    await OrgMember.deleteMany({organization : orgId})
    const organization = await Organization.findByIdAndDelete(orgId);

    if (!organization) {
        throw new ApiError(404, "Organization not found");
    }

    res.status(200).json(new ApiResponse(200, organization, "Organization deleted successfully" ));
})

// 4. Get Organization by ID , todo: remove this if not used in future
const org = asyncHandler(async (req, res) => {
    const { orgId } = req.params;

    const organization = await Organization.findById(orgId);

    if (!organization) {
        throw new ApiError(404, "Organization not found");
    }

    res.status(200).json(new ApiResponse(200, organization, "Organization retrieved successfully"));
})

// 5. Get All Organizations of current user where user is a member
const allOrgs = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const memberships = await OrgMember.find({
        userId : userId,
        status: 'accepted',
    }).select("organization").populate("organization")

    // console.log(memberships);

    const orgs = memberships.map(m => m.organization)

    // console.log("all organizations : ", orgs)

    res.status(200).json(new ApiResponse(200, orgs, "Organizations retrieved successfully"));
})

// 6. Get the current member of current organization
const orgCurrentMember = asyncHandler(async (req,res) => {

    const { orgId } = req.params;
    if(!orgId){
        throw new ApiError(400, "Organization Id is required")
    }

    const currentMember = await OrgMember.findOne({
        organization: orgId,
        userId: req.user._id
    })

    if(!currentMember){
        throw new ApiError(400, "You are not a member of this organization")
    }

    // console.log("current org member ", currentMember)
    return res.status(201).json(
        new ApiResponse(201, currentMember, "Current Member of current organization is successfully fetched")
    );

})

// 7. Add members to organization
const addMember = asyncHandler(async (req, res) => {

    // 1. Take inputs
    const orgId = req.params.orgId;
    const { email, role } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required to invite a member.");
    }

    // 2. Check organization exists
    const org = await Organization.findById(orgId);
    if (!org) {
        throw new ApiError(404, "Organization not found.");
    }

    // todo : send invite link on email and remove this user registered or not

    // 3. Check if the user being invited exists
    const invitedUser = await User.findOne({ email });
    if (!invitedUser) {
        throw new ApiError(404, "No user found with this email. Please register the member on the app first");
    }

    // 4. Prevent duplicate membership
    const existingMember = await OrgMember.findOne({
        userId: invitedUser._id,
        organization: orgId
    });

    if (existingMember) {
        throw new ApiError(400, "User is already a member or has already been invited.");
    }

    // 5. Create OrgMember invitation
    const newMember = await OrgMember.create({
        userId: invitedUser._id,
        organization: orgId,
        role: role || "member",
        status: "invited"
    });

    return res.status(201).json(
        new ApiResponse(201, newMember, "Invitation sent to user successfully.")
    );
});

// 8. Remove members from organization
const removeMember = asyncHandler(async (req, res) => {

    // 1. Take input
    const {orgId, memberId} = req.params.orgId;

    // 2. Ensure org exists
    const organization = await Organization.findById(orgId);
    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    // 2. Prevent removing the owner
    if (organization.owner.toString() === memberId) {
        throw new ApiError(403, "Cannot remove the organization owner.");
    }

    // 3. Check if user is actually a member
    const memberRecord = await OrgMember.findOne({
        userId: userIdToRemove,
        organization: orgId
    });

    if (!memberRecord) {
        throw new ApiError(404, "User is not a member of this organization.");
    }

    // 4. Delete member record
    await OrgMember.deleteOne({
        userId: userIdToRemove,
        organization: orgId
    });

    return res.status(200).json(
        new ApiResponse(200, null, "Member removed from organization successfully.")
    );
});

// Initial Payment Function
const initiatePayment = async ({ userId, tier, amount }) => {
    if (!userId || !tier) {
        throw new ApiError(400, "User ID and tier are required for payment initiation.");
    }

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
    });

    const payment = await Payment.create({
        userId,
        plan: tier,
        amount,
        paymentStatus: "pending",
        razorpayOrderId: order.id,
    });

    return { order, paymentId: payment._id };
};

export {
    createOrg,
    updateOrg,
    deleteOrg,
    org,
    allOrgs,
    orgCurrentMember,
    addMember,
    removeMember
}