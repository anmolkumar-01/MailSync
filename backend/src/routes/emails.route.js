import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'

import{
    uploadFile,
    askAI,
    send,
    open
} from "../controllers/emails.controller.js"

const router = Router()

router.post("/uploadFile" , verifyJWT, upload.fields([{name: 'emailData', maxCount:1}]), uploadFile)
router.post("/askAI" , verifyJWT, askAI)
router.post("/send",verifyJWT, upload.array('fileData'), send)
router.get("/open/:emailId.png" , open)

export default router