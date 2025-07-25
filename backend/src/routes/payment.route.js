import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'

import{
    verify,
} from "../controllers/payment.controller.js"

const router = Router()

router.use(verifyJWT)

router.post("/payment-verify", verify)

export default router