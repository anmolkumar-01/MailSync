import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'


export const useAppStore = create((set, get) => ({

    user: JSON.parse(localStorage.getItem("user")) || null,

    isSigningIn: false,
    isExtractingEmails: false,
    isAskingAi: false,
    isSendingEmail: false,

    extractedEmails: [],
    uploadedFiles:[],
    aiResponse: null,
    sendEmailReply: '',
    error: null,

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

        } catch (error) {
            set({error: error.response?.data?.message})
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
        } catch (error) {
            set({error: error.response?.data?.message})
            console.error("Error in logout",error)
        }
    },

    // 3. Upload files
    uploadFile: async(formData) => {
        set({isExtractingEmails: true})
        try {
            const res = await axiosInstance.post('/user/uploadFile', formData)
            // console.log("data coming in upload route from axios is " , res.data?.data)
            set({extractedEmails: res.data.data})

        } catch (error) {
            console.error("Error in uploading file: ", error.response?.data?.message);
            set({error: error.response?.data?.message})
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


}))