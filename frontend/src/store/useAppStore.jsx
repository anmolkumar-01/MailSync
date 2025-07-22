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

    subject: '',
    body: '',

    error: null,
    uploadedFileName: null,
    attachmentsAvailable: false,

    notifications: [],

    // 1. Sign In
    signin: async(code) => {

        set({isSigningIn : true})
        try {
            const res = await axiosInstance.post('/auth/signin', { code })
            // console.log("data coming in signin route from axios is " , res.data.data)

            const userData = res.data.data;

            if (!userData.refreshToken) {
                get().triggerNotification("Login successful, but email permissions are missing. Please re-authenticate.", "appError");
            }

            set({user: userData})
            get().triggerNotification("You have successfully signed in", "success")

        } catch (error) {
            get().triggerNotification("Something went wrong during sign-in. Please try again", "error");
            console.error("Error in Signin : " , error.response?.data?.message)
        }finally{
            set({isSigningIn: false})
        }
    },

    // 2. Logout
    logout: async()=>{

        set({
            user: null,
            extractedEmails: [],
            selectedEmails: [],
            uploadedFileName: null,
            subject: '',
            body: '' ,
            attachmentsAvailable: false,
        });

        get().triggerNotification("You have successfully signed out", "success")

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
            get().triggerNotification("Unable to upload the file. Please try again", "appError")
        }finally{
            set({isExtractingEmails: false})
        }
    },

    // 4. AskAI
    askAI: async(query) => {
        set({isAskingAi: true})
        try {
            // console.log("query in ask ai ", query);
            const res = await axiosInstance.post('/user/askAI', {query})
            // console.log("data coming in askAI route from axios is " , res.data?.data)

            const newResponseData = {
                subject: res.data.data.subject,
                body: res.data.data.body,
            };
            const {subject, body} = get()
            // console.log(subject, body)
            set({subject: newResponseData.subject, body: newResponseData.body})
            
            get().triggerNotification("Your draft email has been successfully generated", "notify")
            

        } catch (error) {
            get().triggerNotification(error.response?.data?.message || "Internal server error. Please try again", "appError")
            console.error("Error in asking Ai file: ", error.response?.data?.message);
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
            get().triggerNotification(res.data.message, "success")

            get().setSubject('');
            get().setBody('');

        } catch (error) {
            console.error(error.response?.data?.message);
            get().triggerNotification(error.response?.data?.message || "Internal server error. Please try again", "appError")
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
        // console.log(emails)
        set({ selectedEmails: emails });
    },

    // 4. clear the recipients from the extracted emails
    clearRecipients: () => {
        set({ extractedEmails: [], selectedEmails: [], uploadedFileName: null });
    },

    // 5. set the uploaded file Name
    setUploadedFileName: (name) => {
        set({uploadedFileName: name})
    },

    // set email subject
    setSubject: (subject) => {
        set({ subject })
    },

    setBody: (body) => {
        set({body})
    },

    setAttachmentsAvailable: (state) => {
        set({attachmentsAvailable: state})
    },

    setExtractedEmails: (newEmail) => {
        const { extractedEmails, triggerNotification } = get();

        if (extractedEmails?.includes(newEmail)) {
            triggerNotification("Email already exists in the list ", "appError")
            return;
        }
        set({ extractedEmails: [...extractedEmails, newEmail] });
        triggerNotification(`${newEmail} has been added`, "notify")
    }

}),
    {
        name: 'mailsync-storage',

        partialize: (state) => ({
            user: state.user,
            extractedEmails: state.extractedEmails,
            selectedEmails: state.selectedEmails,
            uploadedFileName: state.uploadedFileName,
            subject: state.subject,
            body: state.body,
            attachmentsAvailable: state.attachmentsAvailable,
            isSendingEmail: state.isSendingEmail,
        }),

    }
))