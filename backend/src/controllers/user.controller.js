import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

import { Organization } from "../models/organizationSchema.js";
import { User } from "../models/userSchema.js";
import { OrgMember } from "../models/orgMemberSchema.js";


// 2. Accept the invite
const acceptInvite = asyncHandler( async (req,res) => {

    const userId = req.user._id
    const {orgId} = req.params;

    if(!orgId || !userId){
        throw new ApiError(400, "UserId and org Id is required");
    }

    const orgMember = await OrgMember.findOneAndUpdate(
        {
            userId,
            organization: orgId,
        },
        {$set: {status: "accepted"}},
        {new : true}
    )

    if(!orgMember){
        throw new ApiError(404, "Org member not found for accepting invite");
    }

    return res.status(200).json(
        new ApiResponse(200, orgMember, "Invite accepted successfully")
    );
    
})

// 2. Reject the invite
const rejectInvite = asyncHandler( async (req,res) => {

    const userId = req.user._id
    const {orgId} = req.params;

    if(!orgId || !userId){
        throw new ApiError(400, "UserId and org Id is required");
    }

    const orgMember = await OrgMember.findOneAndUpdate(
        {
            userId,
            organization: orgId,
        },
        {$set: {status: "rejected"}},
        {new : true}
    )

    if(!orgMember){
        throw new ApiError(404, "Org member not found for rejecting invite");
    }

    return res.status(200).json(
        new ApiResponse(200, orgMember, "Invite accepted successfully")
    );
    
})

// 3. Left an organization
const leftOrg = asyncHandler( async (req,res) => {

    const userId = req.user._id
    const {orgId} = req.params;

    if(!orgId || !userId){
        throw new ApiError(400, "UserId and org Id is required");
    }

    const orgMember = await OrgMember.findOneAndUpdate(
        {
            userId,
            organization: orgId,
        },
        {$set: {status: "left"}},
        {new : true}
    )

    if(!orgMember){
        throw new ApiError(404, "Org member not found for rejecting invite");
    }

    return res.status(200).json(
        new ApiResponse(200, orgMember, "Invite accepted successfully")
    );
    
})

// ------------------------------------- Admin related controllers ---------------------------

//1. Get all the organizations
const adminAllOrgs = asyncHandler(async (req, res) => {

    const allOrgs = await Organization.find()
        .select('name email tier status createdAt owner')
        .populate('owner', 'fullName');

    if(!allOrgs){
        throw new ApiError(400, "Error fetching organizations");
    }

    return res.status(201).json(
        new ApiResponse(200, allOrgs,"Organizations retrieved successfully")
    );

})

//2. Update any organization's status
const adminUpdateOrgStatus = asyncHandler( async (req, res) => {

    const {orgId, status} = req.body;

    if(!orgId || !status){
        throw new ApiError(400, "OrgId and status are required");
    }

    const org = await Organization.findByIdAndUpdate(
        orgId,
        {$set: {status}},
        {new: true}
    )

    if(!org){
        throw new ApiError(404, "Organization not found");
    }

    return res.status(201).json(
        new ApiResponse(200, org,"Organizations updated successfully")
    );

})


export{
    acceptInvite,
    rejectInvite,
    leftOrg,
    adminAllOrgs,
    adminUpdateOrgStatus,
}