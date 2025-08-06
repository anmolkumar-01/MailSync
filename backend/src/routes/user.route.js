import {Router} from 'express'
import { verifyJWT, isAdminLogin } from '../middlewares/auth.middleware.js'

import{
    acceptInvite,
    rejectInvite,
    leftOrg,
    adminAllOrgs,
    adminUpdateOrgStatus
} from "../controllers/user.controller.js"

const router = Router()

router.use(verifyJWT)

router.post("/:orgId/accept-invite", acceptInvite)
router.post("/:orgId/reject-invite", rejectInvite)
router.post("/:orgId/left-org", leftOrg)
router.get("/admin-orgs", isAdminLogin, adminAllOrgs);
router.post("/admin-update-status", isAdminLogin, adminUpdateOrgStatus);


export default router