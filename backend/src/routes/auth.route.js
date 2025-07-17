import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'

import{
    signin,
} from "../controllers/auth.controller.js"

const router = Router()

router.post("/signin" , signin)

export default router