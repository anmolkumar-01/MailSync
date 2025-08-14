import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'

import{
    signin,
    refreshAccessToken
} from "../controllers/auth.controller.js"

const router = Router()

router.post("/signin" , signin)
router.get('/refresh-access-token', verifyJWT, refreshAccessToken);


export default router