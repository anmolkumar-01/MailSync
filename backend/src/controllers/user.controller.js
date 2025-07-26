import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { readFileContent } from "../utils/readFileContent.js";
import { geminiAI } from "../services/geminiApi.js";
import { convertToJson } from "../services/convertToJson.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateEmailFileCardHTML } from "../services/generateEmailFileCard.js";
import { systemPrompt } from "../constants/systemPrompt.js";
import { google } from 'googleapis';
import { encode } from 'js-base64';

import { OrgMember } from "../models/orgMemberSchema.js";
import { Organization } from "../models/organizationSchema.js";
import { User } from "../models/userSchema.js";

// ------------------------------------- sending email related controllers ---------------------------
// todo : change everything according to organization

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
// decode the subject to base64 format
const encodeSubject = (subject) => {
    const base64 = Buffer.from(subject, 'utf-8').toString('base64');
    return `=?UTF-8?B?${base64}?=`;
}

// Helper function to create raw email
const makeRawEmail=({ from, to, subject, html, replyTo }) => {
    const messageParts = [
        `From: ${from}`,
        `To: ${to}`,
        `Subject: ${encodeSubject(subject)}`,
        `Reply-To: ${replyTo}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        '',
        html
    ];

    const message = messageParts.join('\n');

    const encodedMessage = encode(message)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return encodedMessage;
}

// Main send controller
const send = asyncHandler(async (req, res) => {

    // 1. Get data
    const { subject, body, organizationId  } = req.body;
    const recipients = JSON.parse(req.body?.recipients || []);

    if (!subject || !body) {
        throw new ApiError(400, 'Please add the subject line and content for your email');
    }

    if (!organizationId) {
        throw new ApiError(400, 'Oranization is required');
    }

    if (!Array.isArray(recipients) || recipients.length === 0) {
        throw new ApiError(404, 'Recipients emails not found');
    }

    const currentOrg = await Organization.findById(organizationId);
    if(!currentOrg){
        throw new ApiError(404, 'Oranization does not exist');
    }

    // is user a valid member of this organization
    const isMember = currentOrganization.members.includes(req.user._id); // or check roles map
    if (!isMember) {
        throw new ApiError(403, 'You are not a member of this organization');
    }

    // recipients list must not be greater than daily Limit
    if(currentOrg.dailyLimit == 0){
        throw new ApiError(403, `Daily email sending limit exceeded. Please try again tomorrow`);
    }
    if(recipients.length > currentOrg.dailyLimit){
        throw new ApiError(403, `Your organization can only send ${currentOrg.dailyLimit} emails today`);
    }

    const owner = await User.findById(currentOrg.owner);
    if (!owner || !owner.refreshToken) {
        throw new ApiError(400, 'Organization owner is not properly configured to send emails');
    }

    // 2.Handle uploaded files and upload to Cloudinary
    const fileData = req.files || [];
    let localFilePathArray = [];
    let requiredData = [];

    if (fileData.length) {
        for (const file of fileData) {
            localFilePathArray.push(file.path);
        }

        const cloudinaryResponses = await uploadOnCloudinary(localFilePathArray);

        if (!cloudinaryResponses) {
            throw new ApiError(400, "Unsupported file format. Please send another file");
        }

        requiredData = cloudinaryResponses.map(file => ({
            name: file.original_filename,
            url: file.secure_url,
            size: file.bytes
        }));
    }

    // Generate files HTML block
    const filesHTML = generateEmailFileCardHTML(requiredData);

    // Prepare final email HTML
    const html = `
    <div style="margin: 0; padding: 0; font-family: sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 700px; margin: 20px auto; border: 1px solid black; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <tr>
                <td align="center" style="background-color: #3b82f6; padding: 20px; border-radius: 12px 12px 0 0;">
                    <img src="https://cdn-icons-png.flaticon.com/512/893/893257.png" alt="Logo" width="40" style="border:0; display:inline-block; vertical-align:middle; margin-right: 10px;">
                    <span style="color: #ffffff; font-size: 24px; font-weight: bold;">MailSync</span>
                </td>
            </tr>
            <tr>
                <td style="background-color: #ffffff; padding: 20px 30px; border-radius: 0 0 12px 12px;">
                    <div>${body}</div>
                    ${filesHTML}
                </td>
            </tr>
        </table>
    </div>
    `;

    
    // Gmail API Setup
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "postmessage"
    );

    oAuth2Client.setCredentials({
        refresh_token: owner.refreshToken
    });

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    let users = 0;

    // Send emails parallelly
    await Promise.all(recipients.map(async (email) => {
        try {
            const raw = makeRawEmail({
                from: `${currentOrg.name} <${currentOrg.email}>`,
                to: email,
                subject,
                html,
                replyTo: currentOrg.email
            });

            await gmail.users.messages.send({
                userId: 'me',
                requestBody: { raw }
            });

            users++;

        } catch (err) {
            console.log(`Failed to send email to ${email}:`, err.message);
            throw new ApiError(400, `Failed to send email to ${email}. Please try again later.`);
        }
    }));

    currentOrg.dailyLimit -= users;
    await currentOrg.save();

    return res.status(201).json(
        new ApiResponse(200, requiredData, `Email has been successfully sent to ${users} ${users === 1 ? 'user' : 'users'}`)
    );
});

// ------------------------------------- app related controllers ---------------------------

// 1. Get all the invitation
const allInvites = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 1. Find all pending invites
    const invites = await OrgMember.find({
        userId,
        status: "invited"
    })
    .populate("organization", "name email tier dailyLimit") // Select org fields you want to expose
    .sort({ invitedAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, invites, "Pending invites retrieved successfully")
    );
});

// 2. Accept the invitation request
const acceptInvite = asyncHandler(async (req, res) => {

    // 1. Take inputs
    const userId = req.user._id;
    const { organizationId } = req.body;

    if (!organizationId) {
        throw new ApiError(400, "Organization ID is required to accept an invite.");
    }

    // 2. Find invite
    const member = await OrgMember.findOne({
        userId,
        organization: organizationId,
        status: "invited"
    });

    if (!member) {
        throw new ApiError(404, "No pending invite found for this organization.");
    }

    // 3. Update status to accepted
    member.status = "accepted";
    await member.save();

    return res.status(200).json(
        new ApiResponse(200, member, "Invitation accepted successfully.")
    );
});

// 3. Reject the invitation request
const rejectInvite = asyncHandler(async (req, res) => {

    // 1. Take inputs
    const userId = req.user._id;
    const { organizationId } = req.body;

    if (!organizationId) {
        throw new ApiError(400, "Organization ID is required to accept an invite.");
    }

    // 2. Find invite
    const member = await OrgMember.findOne({
        userId,
        organization: organizationId,
        status: "invited"
    });

    if (!member) {
        throw new ApiError(404, "No pending invite found for this organization.");
    }

    // 3. Update status to accepted
    member.status = "rejected";
    await member.save();

    return res.status(200).json(
        new ApiResponse(200, member, "Invitation accepted successfully.")
    );
});

export{
    uploadFile,
    askAI,
    send,
    allInvites,
    acceptInvite,
    rejectInvite
}