import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'

import{
    uploadFile,
    askAI,
    send
} from "../controllers/user.controller.js"

const router = Router()

router.use(verifyJWT);

router.post("/uploadFile" , uploadFile)
router.post("/askAI" , askAI)
router.get("/send" ,send)


export default router