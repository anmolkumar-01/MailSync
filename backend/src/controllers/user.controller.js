import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/userSchema.js"
import { readFileContent } from "../utils/readFileContent.js";
import { geminiAI } from "../services/geminiApi.js";
import { convertToJson } from "../services/convertToJson.js";
import { transporter } from "../services/mailTransporter.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateEmailFileCardHTML } from "../services/generateEmailFileCard.js";
import { systemPrompt } from "../constants/systemPrompt.js";

// 1. uploading the file and extract emails
const uploadFile = asyncHandler( async(req, res) => {

    // 1.  -------- Getting files
    const {emailData} = req.files;
    console.log("Data is here" ,emailData);

    const filePath = emailData?.[0]?.path;
    const originalName = emailData?.[0]?.originalname;

    if(!filePath || !originalName){
        throw new ApiError(400 , "File is required")
    }

    // 2. -------- Extracting the written text data
    const textData = await readFileContent(filePath, originalName)
    // console.log(textData);

    if(!textData){
        throw new ApiError(400 , "Error in fetching data from file")
    }
    
    // additional filteration
    const regex = /[\w.-]+@[\w.-]+\.\w{2,}/g;
    const extractedEmails = textData.match(regex);

    console.log('here is extractedEmails',extractedEmails)


    return res.status(201).json(
        new ApiResponse(200, extractedEmails , "Emails extraction successful")
    )
})

// 2. generate email subject and body
const askAI = asyncHandler( async(req, res) => {

    const {query} = req.body

    if(!query?.trim()){
        throw new ApiError(400 , "Please enter a prompt before generating")
    }

    const prompt = `${systemPrompt}
        USER'S PROMPT : ${query}
    `
    
    const geminiResponse = await geminiAI(prompt);

    if(!geminiResponse.trim()){
        throw new ApiError(400 , "Please elaborate more")
    }

    const email = await convertToJson(geminiResponse);
    if(!email){
        throw new ApiError(400 , "Please elaborate more..")
    }
    // // console.log(email.body);

    return res.status(201).json(
        new ApiResponse(200, email , " successfully generated email")
    )
})

// 3. sending email
const send = asyncHandler( async(req, res) => {

    // console.log("Data in send backend: ", req.body)

    const {subject, body} = req.body
    const recipients = JSON.parse(req.body?.recipients || [])

    const currentUser = req.user;
    // console.log(currentUser)

    if(!subject){
        throw new ApiError(400, 'Subject field is required');
    }

    if (!Array.isArray(recipients) || recipients.length === 0) {
        throw new ApiError(404, '404: Recipients emails not found');
    }
    // console.log(recipients)

    // handling the uploaded files
    const fileData = req.files || []
    // console.log("filedata : ", req.files);

    let localFilePathArray = []
    let requiredData = []

    if(fileData.length){
        for(const file of fileData){
            localFilePathArray.push(file.path)
        }
        const cloudinaryResponses = await uploadOnCloudinary(localFilePathArray)
        // console.log(cloudinaryResponses)
        requiredData = cloudinaryResponses.map(file => ({
            name: file.original_filename,
            url: file.secure_url,
            size: file.bytes
        }));

    }

    const filesHTML = generateEmailFileCardHTML(requiredData)

    const html = ` 
        <div>
            ${body}
        </div>
        <br><br>
        ${filesHTML}
        
        <div style="padding-top:20px;">
            <hr style="border:none; border-top:1px solid #e5e7eb;"/>
            <p style="font-size: 0.9em; color: #555; font-family: sans-serif;">
                This message was sent by <strong>${currentUser.fullName}</strong> (${currentUser.email}) through the <strong>MailSync</strong> app.
            </p>
        </div>
    `;

    console.log(html)

        
    let users = 0;
    // sending parallelly
    await Promise.all(
    recipients.map(async (email) => {
        try {
            await transporter.sendMail({
                from: `${currentUser.fullName} <${process.env.EMAIL_USER}>`,
                to: email,
                subject,
                html,
                replyTo: currentUser.email
            });
            users++;

        } catch (err) {
        console.log(`Failed to send email to ${email}:`, err.message);
        }
    })
    );

    console.log("emails sent to : " , users)    
    
    return res.status(201).json(
        new ApiResponse(200, requiredData , `Email has been successfully sent to ${users} users`)
    )

})

export{
    uploadFile,
    askAI,
    send
}