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

    // console.log("Data is here" ,emailData);

    const filePath = emailData?.[0]?.path;
    const originalName = emailData?.[0]?.originalname;

    if(!filePath || !originalName){
        throw new ApiError(400 , "Please select and upload a file to continue")
    }

    // 2. -------- Extracting the written text data
    const textData = await readFileContent(filePath, originalName)
    // console.log(textData);

    if(!textData){
        throw new ApiError(400 , "Internal server error. Please try again")
    }
    
    // additional filteration
    const regex = /[\w.-]+@[\w.-]+\.\w{2,}/g;
    const extractedEmails = textData.match(regex);

    // console.log('here is extractedEmails',extractedEmails)


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

    if(!geminiResponse?.trim() ){
        throw new ApiError(400 , "Please provide more context about your email")
    }

    const email = await convertToJson(geminiResponse);
    if(!email){
        throw new ApiError(400 , "Please provide more context about your email")
    }
    // console.log(email.body);

    return res.status(201).json(
        new ApiResponse(200, email , "successfully generated email")
    )
})

// 3. sending email
const send = asyncHandler( async(req, res) => {

    // console.log("Data in send backend: ", req.body)

    const {subject, body} = req.body
    const recipients = JSON.parse(req.body?.recipients || [])

    const currentUser = req.user;
    // console.log(currentUser)

    if(!subject || !body ){
        throw new ApiError(400, 'Please add the subject line and content for your email');
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

        if(!cloudinaryResponses){
            throw new ApiError(400, "Unsupported file format. Please send another file")
        }
        // console.log(cloudinaryResponses)
        requiredData = cloudinaryResponses.map(file => ({
            name: file.original_filename,
            url: file.secure_url,
            size: file.bytes
        }));

    }

    const filesHTML = generateEmailFileCardHTML(requiredData)

    const html = ` 
    <div style="margin: 0; padding: 0; font-family: sans-serif;">

        <!-- Main container table -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px; margin: 20px auto; border: 1px solid black; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            
            <!-- Header Row -->
            <tr>
                <td align="center" style="background-color: #3b82f6; padding: 20px; border-radius: 12px 12px 0 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center" style="color: #ffffff; font-size: 24px; font-weight: bold; font-family: sans-serif;">
                                <!-- Placeholder for a white logo -->
                                <img src="https://cdn-icons-png.flaticon.com/512/893/893257.png" alt="Logo" width="40" style="border:0; display:inline-block; vertical-align:middle; margin-right: 10px;">
                                MailSync
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Content Row -->
            <tr>
                <td style="background-color: #ffffff; padding: 20px 30px; border-radius: 0 0 12px 12px;">
                    
                    <!-- YOUR EXISTING CONTENT GOES HERE -->
                    <div>
                        ${body}
                    </div>
                    
                    ${filesHTML}
                    
                </td>
            </tr>

            <tr>
                <td style="font-size: 0.9em; padding: 20px">
                    This message was sent by <strong>${currentUser.fullName}</strong> (${currentUser.email}) through the <strong>MailSync</strong> app.
                </td>
            </tr>

        </table>

        <!-- Your original footer remains outside the main container -->
 

    </div>
    `;

    // console.log(html)

        
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
            // throw new ApiError(400, `${email} is not a valid email`)
            throw new ApiError(400, "Daily email sending limit exceeded. You can send more emails after 24 hours")
        }
    })
    );

    // console.log("emails sent to : " , users)    
    
    return res.status(201).json(
        new ApiResponse(200, requiredData , `Email has been successfully sent to ${users} ${users == 1 ? 'user' : 'users'}`)
    )

})

export{
    uploadFile,
    askAI,
    send
}