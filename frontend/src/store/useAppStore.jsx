import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'
import { persist } from 'zustand/middleware'


export const useAppStore = create(

persist(
    (set, get) => ({

    user: null,

    isSigningIn: false,
    isExtractingEmails: false,
    isAskingAi: false,
    isSendingEmail: false,

    extractedEmails:[],
    selectedEmails: [],

    aiResponse: null,

    error: null,
    uploadedFileName: null,

    notifications: [],

    // 1. Sign In
    signin: async(formData) => {

        set({isSigningIn : true})
        try {
            console.log("herer is the data: ", formData)
            const res = await axiosInstance.post('/auth/signin', formData)
            console.log("data coming in signin route from axios is " , res.data.data)
            set({user: res.data.data})

            // saving in store
            

            get().triggerNotification("You have successfully signed in", "success")

        } catch (error) {
            get().triggerNotification("An unknown error occurred. Please try again", "error");
            console.error("Error in Signin : " , error.response?.data?.message)
        }finally{
            set({isSigningIn: false})
        }
    },

    // 2. Logout
    logout: async()=>{
        try {
            await axiosInstance.post('/auth/logout')
            set({user: null})
            
            

            get().triggerNotification("You have successfully signed out", "success")

        } catch (error) {
            get().triggerNotification("An Unknown error occurred. Please try again", "error")
            console.error("Error in logout",error.response?.data?.message)
        }
    },

    // 3. Upload files
    uploadFile: async(formData) => {
        set({isExtractingEmails: true})
        try {
            const res = await axiosInstance.post('/user/uploadFile', formData)
            // console.log("data coming in upload route from backend is " , res.data?.data)
            const emails = res.data?.data || [];
            const fileName = formData.get("emailData").name

            set({extractedEmails: emails, uploadedFileName: fileName})
            
            const message = emails.length === 0 ? "No email addresses found" : `${emails.length} email ${emails.length === 1 ? "address" : "addresses"} found`;
            get().triggerNotification(`${message}`, "notify")

        } catch (error) {
            console.error("Error in uploading file: ", error);
            get().triggerNotification("Unable to upload the file. Please try again", "error")
        }finally{
            set({isExtractingEmails: false})
        }
    },

    // 4. AskAI
    askAI: async(query) => {
        set({isAskingAi: true})
        try {
            console.log("query in ask ai ", query);
            const res = await axiosInstance.post('/user/askAI', {query})
            console.log("data coming in askAI route from axios is " , res.data?.data)

            const newResponseData = {
                subject: res.data.data.subject,
                body: res.data.data.body,
            };
            
            get().triggerNotification("Your draft email has been successfully generated", "success")
            set({aiResponse: newResponseData})
            return newResponseData;

        } catch (error) {
            get().triggerNotification("An unknown error occurred. Please try again", "error")
            console.error("Error in uploading file: ", error);
        }finally{
            set({isAskingAi: false})
        }
    },

    // 5. Send Emails
    send: async(formData) => {
        set({isSendingEmail: true})
        try {
            const res = await axiosInstance.post('/user/send', formData)
            // console.log("data coming in send email route from axios is " , res)
            set({sendEmailReply: res.data.message})

        } catch (error) {
            set({error: error.response?.data?.message})
            console.error(error.response?.data?.message, error);
        }finally{
            set({isSendingEmail: false})
        }
    },


    // ----------- frontend related functions ----------------

    // 1. Show the Notification
    triggerNotification: (message, status = 'success') => {
        const newNotification = {
            id: Date.now(), 
            message,
            status,
        };

        set((state) => ({
        notifications: [...state.notifications, newNotification],
        }));
    },

    // 2. Close the notification : automatically called by notificaion jsx
    closeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }));
    },

    // 3. Set the emails user mark as selected 
    setSelectedEmails: (emails) => {
        console.log(emails)
        set({ selectedEmails: emails });
    },

    // 4. clear the recipients from the extracted emails
    clearRecipients: () => {
        set({ extractedEmails: [], selectedEmails: [], uploadedFileName: null });
    },

    // 5. set the name of the uploaded file
    setUploadedFileName: (name) => {
        set({uploadedFileName: name})
    }
})),
    {
        name: 'mailsync-storage',

        partialize: (state) => ({
            user: state.user,
            extractedEmails: state.extractedEmails,
            selectedEmails: state.selectedEmails,
            uploadedFileName: state.uploadedFileName
        }),

    }

)