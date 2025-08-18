import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'
import { persist } from 'zustand/middleware'
import {io} from 'socket.io-client'

export const useAppStore = create(

persist(
    (set, get) => ({

    currentUser: null,

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

    orgs: [],
    invitedOrgs: [],
    currentOrgMembers: [],
    selectedOrg: null,
    setSelectedOrg: (org) => set({ selectedOrg: org }),

    orgCurrentUser: null,
    currentView: 'user-dashboard',
    setCurrentView: (view) => set({ currentView: view }),
    orgSubView: 'send-email',
    setOrgSubView: (view) => set({orgSubView: view}),

    notifications: [],
    
    
        // ------- Socket io functions
    socket: null,
    onlineUsers: [],

    // Connect socket when user logs in
    connectSocket: () => {
        const {currentUser, socket} = get()

        if(!currentUser || socket?.connected) return ;
        const userId = currentUser._id

        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const newSocket = io( BACKEND_URL, {
            query: { userId },
            withCredentials: true,
        });

        newSocket.on("onlineUsers", (users) => {
            // console.log(" Online users in socket io:", users);
            set({ onlineUsers: users });
        });

        // console.log("Socket connected:", newSocket);

        set({ socket: newSocket });
    },

    // Disconnect socket on logout
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null, onlineUsers: [] });
        }
    },

    // ------------------------------ User and auth related  ----------------
    
    adminOrgs:[],
    isFetchingAdminOrgs: false,
    isUpdatingStatus: false,

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

            set({currentUser: userData})
            get().connectSocket()
            get().triggerNotification("You have successfully signed in", "success")

        } catch (error) {
            get().triggerNotification("Something went wrong during sign-in. Please try again", "error");
            console.error("Error in Signin : " , error.response?.data?.message || error)
        }finally{
            set({isSigningIn: false})
        }
    },

    // 2. Logout
    logout: async()=>{

        set({
            currentUser: null,
            extractedEmails: [],
            selectedEmails: [],
            uploadedFileName: null,
            subject: '',
            body: '' ,
            attachmentsAvailable: false,
            orgSubView: '',
            selectedOrg: null,
            currentView: '',
        });

        get().disconnectSocket()
        get().triggerNotification("You have successfully signed out", "success")

    },

    // 3. Accept the invite to an orgnization
    acceptInvite: async (orgId) => {
        try {
            const res = await axiosInstance.post(`/user/${orgId}/accept-invite`);
            
            get().fetchUserOrgs();
            get().triggerNotification("Invitation accepted successfully", "notify");

        } catch (err) {
            console.error("Error in accepting invite:", err.response?.data?.message || err);
            get().triggerNotification("Failed to accept invite", "appError");
        }
    },

    // 4. Reject the invite to an orgnaization
    rejectInvite: async (orgId) => {
        try {
            const res = await axiosInstance.post(`/user/${orgId}/reject-invite`);

            get().fetchUserOrgs();
            get().triggerNotification("Invitation rejected successfully", "notify");

        } catch (err) {
            console.error("Error in rejecting invite:", err.response?.data?.message || err);
            get().triggerNotification("Failed to reject invite", "appError");
        }
    },

    // 5. Left an orgnaization
    leftOrg: async (orgId) => {
        try {
            const res = await axiosInstance.post(`/user/${orgId}/left-org`);

            get().fetchUserOrgs();
            get().triggerNotification("Successfully Left", "notify");

        } catch (err) {
            console.error("Error in Left org :", err.response?.data?.message || err);
            get().triggerNotification("Failed to left Organization", "appError");
        }
    },

    // 6. get all orgs of the admin,
    fetchAdminOrgs: async() => {
        set({isFetchingAdminOrgs: true})
        try {
            
            const res = await axiosInstance.get('/user/admin-orgs');
            // console.log("admin orgs : ", res.data?.data)
            set({adminOrgs: res.data?.data});

        } catch (error) {
            console.error("Error in fetching admin orgs: ", error.response?.data?.message || error);
        } finally{
            set({isFetchingAdminOrgs: false})
        }
    } ,

    adminUpdateOrgStatus: async({orgId, status}) => {
        set({isUpdatingStatus: true})
        try {
            const res = await axiosInstance.post('/user/admin-update-status', {orgId, status});
            // console.log("updated org : ", res.data?.data)
            get().fetchAdminOrgs()
            get().triggerNotification(`Status of ${res.data?.data?.name || "organization" } updated successfully`, "notify" )

        } catch (error) {
            console.error("Error in updating organization status: ", error.response?.data?.message || error);
            get().triggerNotification(`Error in updating status of ${res.data?.data?.name || "organization" }. Please try again`, "appError")
        } finally{
            set({isUpdatingStatus: false})
        }
    } ,

    adminTotalRevenue: 0, 
    fetchAdminTotalRevenue: async() => {
        // set({isFetchingAdminOrgs: true})
        try {
            
            const res = await axiosInstance.get('/payment/admin-total-revenue');
            // console.log("total revenue : ", res.data?.data)
            set({adminTotalRevenue: res.data?.data});

        } catch (error) {
            console.error("Error in fetching admin total revenue: ", error.response?.data?.message || error);
        } finally{
            // set({isFetchingAdminOrgs: false})
        }
    } ,


    // --------------------- ORGANIZATION RELATED ROUTES ----------------------

    // Set the current org

    handleSelectOrg: (org) => {
        if (org.id === 'admin-panel') {
            get().setCurrentView('admin-panel');
            get().setOrgSubView('')
        } else {
            get().setCurrentView('org-dashboard');
            set({
                extractedEmails: [],
                selectedEmails: [],
                uploadedFileName: null,
                subject: '',
                body: '' ,
                attachmentsAvailable: false,
            })
            get().setSelectedOrg(org);
            get().setOrgSubView(currentUser.email === org.email? 'analytics' : 'send-email')

        }
    },

    // 1. Fetch all orgs where current user is a member
    fetchUserOrgs: async () => {
        try {
            const res = await axiosInstance.get("/org/allOrgs");
            // console.log("user organizations : ", res.data.data);
            const memberships = res.data?.data || [];

            // 
            const orgs = memberships
                .filter(m=> (m.status === 'accepted'))
                .map(m => m.organization)
            
            const invitedOrgs = memberships
                .filter(m => m.status === 'invited')
                .map(m => m.organization)

            set({ orgs });
            set({ invitedOrgs })

        } catch (err) {
            console.error("Error fetching orgs:", err);
            get().triggerNotification("Failed to load organizations", "appError");
        }
    },

    // payment gateway
    openRazorpayCheckout: (order, orgInfo) => {
        try {
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "MailSync",
                description: "Organization Plan Upgrade",
                order_id: order.id,
    
                handler: async function (response) {
                    const verification = await axiosInstance.post('/payment/payment-verify', {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        orgInfo
                    });
                    
                    // console.log("verification: ", verification)
                    get().fetchUserOrgs();
                    get().triggerNotification("Payment Successfull", "success");
                    get().triggerNotification("Organization created successfully.", "success");
                // Show success and fetch orgs again
                },
                prefill: {
                    name: get().currentUser.fullName,
                    email: orgInfo.email
                },
                theme: {
                    color: "#6366f1"
                }
            };
    
            // console.log("options: ", options)
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Error in payment :", error?.response?.data?.message || error)
            get().triggerNotification(err.response?.data?.message || "Payment failed", "error");
        }
    },

    // 2. Create an org (free tier or paid)
    createOrg: async (orgData) => {
        try {
            // console.log(orgData);
            const res = await axiosInstance.post("/org/createOrg", orgData);
            const data = res.data?.data;

            if (data?.tier === "free") {
                get().triggerNotification("Organization created. Awaiting admin approval.", "success");
            } else {
                // redirect user to Razorpay checkout using returned order ID
                const { razorpayOrder, paymentId, tier, amount, orgInfo } = data;
                // console.log(razorpayOrder, paymentId);
                get().openRazorpayCheckout(razorpayOrder, orgInfo);
            }

            get().fetchUserOrgs();

        } catch (err) {
            console.error("Error creating org:", err.response?.data?.message || err);
            get().triggerNotification(err.response?.data?.message || "Failed to create org", "appError");
        }
    },

    // 3. delete an org
    deleteOrg: async (orgId) => {
        try {
            await axiosInstance.delete(`/org/deleteOrg/${orgId}`);
            await get().fetchUserOrgs(); // Refresh orgs after deletion
            get().triggerNotification("Organization deleted", "success");
        } catch (err) {
            console.error("Error deleting org:", err);
            get().triggerNotification("Failed to delete organization", "appError");
        }
    },

    // 4. updatea an org
    updateOrg: async (orgId, updates) => {
        try {
            // console.log(orgId);
            await axiosInstance.put(`/org/updateOrg/${orgId}`, updates);
            await get().fetchUserOrgs(); // Refresh after update
            get().triggerNotification("Organization updated", "success");
        } catch (err) {
            console.error("Error updating org:", err.response.data.message);
            get().triggerNotification("Failed to update organization", "appError");
        }
    },

    // 5. get the role of user in current organization
    fetchOrgCurrentUser: async (orgId) => {
        try {
            const res = await axiosInstance.get(`/org/${orgId}/org-current-member`);
            // console.log("current user's role in current org in app store : ", res);
            const user = res.data?.data;
            // console.log(user)
            set({ orgCurrentUser: user,
                orgSubView: user.role === 'orgAdmin'? 'analytics' : 'send-email'
            });

        } catch (err) {
            console.error("Error fetching current User of Organization:", err);
            get().triggerNotification("Failed to fetch organization", "appError");
        }
    },

    // 6. Fetch all members of current org
    fetchCurrentOrgMembers: async (orgId) => {
        try {
            const res = await axiosInstance.get(`/org/${orgId}/all-members`);
            // console.log("current org members : ", res.data?.data?.[0])
            set({ currentOrgMembers: res.data?.data });
        } catch (err) {
            console.error("Error fetching members:", err);
            get().triggerNotification("Failed to load members", "appError");
        }
    },

    // 7. Invite member to a current organization
    inviteMember: async ({orgId, email, role = "member"}) => {
        try {
            const res = await axiosInstance.post(`/org/${orgId}/invite-member`, { email, role });
            get().fetchCurrentOrgMembers(orgId);
            get().triggerNotification(res.data?.message || "Invitation sent", "success");
        } catch (err) {
            console.error("Error inviting member:", err.response?.data?.message || err);
            get().triggerNotification(err.response?.data?.message || "Failed to invite", "appError");
        }
    },

    // 8. Remove member
    removeMember: async ({orgId, memberId}) => {
        // console.log(memberId)
        try {
            const res = await axiosInstance.delete(`/org/${orgId}/remove-member/${memberId}`);
            await get().fetchCurrentOrgMembers(orgId);
            get().triggerNotification("Member removed successfully", "success");
        } catch (err) {
            console.error("Error removing member:", err.response?.data?.message || err);
            get().triggerNotification(err.response?.data?.message || "Failed to remove member", "appError");
        }
    },

    // 9. Change the role of a user in organization
    changeRole: async ({orgId, memberId, role = "member"}) => {
        try {
            const res = await axiosInstance.put(`/org/${orgId}/change-role`, {role, memberId});
            get().fetchCurrentOrgMembers(orgId);
            get().triggerNotification(res.data?.message || "Role updated successfully", "success");
        } catch (err) {
            console.error("Error updating member role member:", err.response?.data?.message || err);
            get().triggerNotification(err.response?.data?.message || "Failed to update role", "appError");
        }
    },

    // --------------------------- send emails related -------------------- 

    // 1. Upload files
    uploadFile: async(formData) => {
        set({isExtractingEmails: true})
        try {
            const res = await axiosInstance.post('/emails/uploadFile', formData)
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

    // 2. AskAI
    askAI: async(query) => {
        set({isAskingAi: true})
        try {
            // console.log("query in ask ai ", query);
            const res = await axiosInstance.post('/emails/askAI', {query})
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

    // 3. Send Emails
    send: async(formData) => {
        set({isSendingEmail: true})
        try {

            const res = await axiosInstance.post('/emails/send', formData)
            
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

    weeklyEmailAnalytics: null,
    isFetchingWeeklyEmailAnalytics: false,
    // 4. Weekly email analytics
    fetchWeeklyEmailAnalytics: async({orgId}) => {
        set({isFetchingWeeklyEmailAnalytics: true})
        try {

            const res = await axiosInstance.get(`/emails/weekly-email-analytics/${orgId}`)
            // console.log("data coming in weekly email analytics route from axios is " , res?.data?.data)
            set({weeklyEmailAnalytics: res?.data?.data})
            return res.data.data;

        } catch (error) {
            console.error(error.response?.data?.message);
            get().triggerNotification(error.response?.data?.message || "Internal server error. Please try again", "appError")
        }finally{
            set({isFetchingWeeklyEmailAnalytics: false})
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
    },

}),
    {
        name: 'mailsync-storage',

        partialize: (state) => ({
            currentUser: state.currentUser,
            extractedEmails: state.extractedEmails,
            selectedEmails: state.selectedEmails,
            uploadedFileName: state.uploadedFileName,
            subject: state.subject,
            body: state.body,
            attachmentsAvailable: state.attachmentsAvailable,
            isSendingEmail: state.isSendingEmail,
            currentView: state.currentView,
            selectedOrg: state.selectedOrg,
            orgSubView: state.orgSubView,

        }),

    }
))