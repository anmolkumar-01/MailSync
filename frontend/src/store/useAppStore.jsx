import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'


export const useAppStore = create((set, get) => ({

    user: JSON.parse(localStorage.getItem("user")) || null,

    isSigningIn: false,
    isExtractingEmails: false,
    isAskingAi: false,
    isSendingEmail: false,

    extractedEmails: JSON.parse(localStorage.getItem("extractedEmails")) || [],
    selectedEmails: [],

    uploadedFiles:[],
    aiResponse: null,
    sendEmailReply: '',
    error: null,

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
            localStorage.setItem("user", JSON.stringify(res.data.data));

            get().triggerNotification("You have successfully signed in", "success")

        } catch (error) {
            get().triggerNotification("Error in signing in", "error");
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
            localStorage.removeItem("user");

            get().triggerNotification("You have successfully signed out", "success")

        } catch (error) {
            get().triggerNotification("Error in signing in", "error")
            console.error("Error in logout",error.response?.data?.message)
        }
    },

    // 3. Upload files
    uploadFile: async(formData) => {
        set({isExtractingEmails: true})
        try {
            const res = await axiosInstance.post('/user/uploadFile', formData)
            console.log("data coming in upload route from axios is " , res.data?.data)
            set({extractedEmails: res.data.data || []})
            localStorage.setItem("extractedEmails", JSON.stringify(res.data.data));

        } catch (error) {
            console.error("Error in uploading file: ", error.response?.data?.message);
            get().triggerNotification("Error in uploading file", "error")
        }finally{
            set({isExtractingEmails: false})
        }
    },

    // 4. AskAI
    askAI: async(query) => {
        set({isAskingAi: true})
        try {
            const res = await axiosInstance.post('/user/askAI', query)
            // console.log("data coming in askAI route from axios is " , res)
            set({aiResponse: res.data})

        } catch (error) {
            set({error: error.response?.data?.message})
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
            console.error("Error in uploading file: ", error);
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

}))