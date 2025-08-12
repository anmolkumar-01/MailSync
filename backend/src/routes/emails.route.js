import {Router} from 'express'
import { isOrgAdminLogin, verifyJWT } from '../middlewares/auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'

import{
    uploadFile,
    askAI,
    send,
    weeklyEmailAnalytics
} from "../controllers/emails.controller.js"

const router = Router()

router.post("/uploadFile" , verifyJWT, upload.fields([{name: 'emailData', maxCount:1}]), uploadFile)
router.post("/askAI" , verifyJWT, askAI)
router.post("/send",verifyJWT, upload.array('fileData'), send)
router.get("/weekly-email-analytics/:orgId", verifyJWT, isOrgAdminLogin, weeklyEmailAnalytics)


export default router