import { User } from "../models/userSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { OrgMember } from "../models/orgMemberSchema.js";
import { Organization } from "../models/organizationSchema.js";

// 1. Is user authenticated
const verifyJWT = asyncHandler( async(req,res , next) => {

    try {
        
        const token = req.cookies?.jwt || req.header("Authorization")?.replace("Bearer" , "")
        // console.log("token in auth.middleware.js : " , req.cookies);

        if(!token){
            throw new ApiError(401 , "Unauthorized Request")
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(401, "Invalid access Token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})

// 2. Is user an orgAdmin or owner of the organization
export const isOrgAdminLogin = asyncHandler(async (req, res, next) => {
    const orgId = req.params.orgId || req.body.orgId;

    if (!orgId) {
        throw new ApiError(400, "Organization ID is required.");
    }

    const org = await Organization.findById(orgId);
    if (!org) {
        throw new ApiError(404, "Organization not found.");
    }

    const userId = req.user._id.toString();
    let isOrgAdmin = false;

    // Check if user is the owner
    if (org.owner.toString() === userId) {
        isOrgAdmin = true;
    }

    // Check if user is an accepted orgAdmin in OrgMember
    const member = await OrgMember.findOne({
        userId: userId,
        organization: orgId,
        role: "orgAdmin",
        status: "accepted"
    });

    if (member) {
        isOrgAdmin = true;
    }

    if(!isOrgAdmin) {
        throw new ApiError(403, "You are not authorized to access this organization.");
    }

    next();
});

// 3. Is user the admin of the Mailsync
export const isAdminLogin = asyncHandler(async(req, res, next) => {

    const user = await Organization.findById(req.user._id);
    if(!user){
        throw new ApiError(404, "User not found")
    }

    if(user.role !== 'admin'){
        throw new ApiError(403, "Unauthorized request !!")
    }

    next();
})

export {verifyJWT}