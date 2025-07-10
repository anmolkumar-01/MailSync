import {v2 as cloudinary} from "cloudinary"
import fs from "fs" // file system - file read , write , remover, etc..

// cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
    
});


// Uploading the locally saved file on Cloudinary

const uploadOnCloudinary = async (localFilePathArray) => {
    try{

        if(!localFilePathArray.length) return null;

        // Map each file to an upload promise - storing each promises
        const uploadPromises = localFilePathArray.map(async (filePath) => (
            cloudinary.uploader.upload(filePath, {
                resource_type: 'raw',
                folder: "MailSync",
                use_filename: true,
                unique_filename: false,
            })
        ));

        // Wait for all uploads to complete in parallel
        const responses = await Promise.all(uploadPromises);
        return responses;   


    }
    catch (error){
        console.error("Error in uploading file to cloudinary", error)
    }finally{
        for(const filePath of localFilePathArray) fs.unlinkSync(filePath)
    }
}

export {uploadOnCloudinary}