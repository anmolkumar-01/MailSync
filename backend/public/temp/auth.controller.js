import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/userSchema.js"
import jwt from 'jsonwebtoken'


// 1. Signup or login => sign in
const signin = asyncHandler( async(req,res) => {

    const {email, fullName} = req.body;
    // console.log("Data coming in signup call : " , req.body)

    if(!email.trim() || !fullName.trim()){
        throw new ApiError(400 , "All fields are required")
    }

    let user = await User.findOne({email:email})
    // if user doesn't exist create one
    if(!user){

        user = await User.create({email, fullName})
    }

    if(!user){
        throw new ApiError(500 , "Internal server Error. Please try again in few minutes.")
    }

    // generate access token 
    const token = jwt.sign(
        {_id: user._id} , 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
    res.cookie('jwt' , token, {
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development'
    })

    return res.status(201).json(
        new ApiResponse(200 , user , "User registered successfully")
    ) 
})

// 2 . Logout the user
const logout = asyncHandler ( async(req,res) => {

    // clear cookies

    return res
    .status(200)
    .clearCookie('jwt')
    .json(new ApiResponse(200 , {}, `user logged out successfully`))
})

// 3. Get current user
const me = asyncHandler( async (req,res) => {

    return res.status(201).json(
        new ApiResponse(200, req.user )
    )

})


export {
    signin,
    logout,
    me
}