import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/userSchema.js"
import { google } from 'googleapis';
import jwt from 'jsonwebtoken'


// 1. Signup or login => sign in
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
);

const signin = asyncHandler(async (req, res) => {

    // 1. getting data
    const { code } = req.body;

    if (!code) {
        throw new ApiError(400, "Google OAuth code is required");
    }

    // excange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
    });

    // get user info
    const { data } = await oauth2.userinfo.get();
    console.log("Google user data: ", data);

    if (!data.email) {
        throw new ApiError(400, "Google account does not have an email");
    }

    let user = await User.findOne({ email: data.email });

    // todo : if user exists then no need for the consent 
    if (!user) {
        user = await User.create({
            email: data.email,
            fullName: data.name,
            profilePic: data.picture,
            refreshToken: tokens.refresh_token
        });
    } 
    else {
        // Update user info + refresh token if new
        user.fullName = data.name;
        user.profilePic = data.picture;
        if (tokens.refresh_token) {
            user.refreshToken = tokens.refresh_token;
        }
        await user.save();
    }

    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV !== 'development'
    });

    const sanitizedUser = user.toObject();
    return res.status(200).json(new ApiResponse(200, sanitizedUser, "Google sign-in successful"));
});

// 2. get the current user
const me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const {refreshToken, ...sanitizedUser} = user.toObject();
    return res.status(200).json(new ApiResponse(200, sanitizedUser, "User retrieved successfully"));
});

export {
    signin,
    me
}