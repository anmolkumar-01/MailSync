import {Router} from 'express'
import { verifyJWT, isAdminLogin } from '../middlewares/auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'

import{
    uploadFile,
    askAI,
    send,
    adminAllOrgs
} from "../controllers/user.controller.js"

const router = Router()


router.post("/uploadFile" , upload.fields([{name: 'emailData', maxCount:1}]), uploadFile)
router.post("/askAI" , askAI)
router.post("/send",verifyJWT, upload.array('fileData'), send)

router.get("/admin-orgs", verifyJWT, adminAllOrgs);




export default router