import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'

import{
    signin,
    me
} from "../controllers/auth.controller.js"

const router = Router()

router.post("/signin" , signin)
router.get("/me", verifyJWT, me)


export default router