import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'

import{
    uploadFile,
    askAI,
    send
} from "../controllers/user.controller.js"

const router = Router()

router.use(verifyJWT);


router.post("/uploadFile" , upload.fields([{name: 'emailData', maxCount:1}]), uploadFile)
router.post("/askAI" , askAI)
router.post("/send", upload.array('fileData'), send)


export default router