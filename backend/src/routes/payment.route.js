import {Router} from 'express'
import { isAdminLogin, verifyJWT } from '../middlewares/auth.middleware.js'

import{
    verify,
    adminTotalRevenue
} from "../controllers/payment.controller.js"

const router = Router()

router.use(verifyJWT)

router.post("/payment-verify", verifyJWT, verify)
router.get("/admin-total-revenue", isAdminLogin, adminTotalRevenue)

export default router