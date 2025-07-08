import { User } from "../models/userSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'


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

export {verifyJWT}