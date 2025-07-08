import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/userSchema.js"

// 1. uploading the file
const uploadFile = asyncHandler( async(req, res) => {})

// 2. Asking ai for the promts
const askAI = asyncHandler( async(req, res) => {})

// 3. sending email
const send = asyncHandler( async(req, res) => {})

export{
    uploadFile,
    askAI,
    send
}