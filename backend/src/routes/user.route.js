import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'

import{
    uploadFile,
    askAI,
    send,
    allInvites,
    acceptInvite,
    rejectInvite
} from "../controllers/user.controller.js"

const router = Router()


router.post("/uploadFile" , upload.fields([{name: 'emailData', maxCount:1}]), uploadFile)
router.post("/askAI" , askAI)
router.post("/send",verifyJWT, upload.array('fileData'), send)

router.get("/all-invite", verifyJWT, allInvites)
router.post("/accept-invite", verifyJWT, acceptInvite)
router.post("/reject-invite", verifyJWT, rejectInvite)


export default router