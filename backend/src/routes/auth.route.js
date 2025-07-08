import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'

import{
    signin,
    logout,
    me
} from "../controllers/auth.controller.js"

const router = Router()

router.post("/signin" , signin)
router.post("/logout" , verifyJWT, logout)
router.get("/me" ,verifyJWT, me)


export default router