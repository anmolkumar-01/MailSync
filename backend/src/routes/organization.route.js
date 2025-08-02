import {Router} from 'express'
import { verifyJWT, isOrgAdminLogin } from '../middlewares/auth.middleware.js'

import{
    createOrg,
    updateOrg,
    deleteOrg,
    org,
    allOrgs,
    orgCurrentMember,
    addMember,
    removeMember
} from "../controllers/organization.controller.js"

const router = Router()

router.use(verifyJWT)

router.post("/createOrg" , createOrg)
router.put("/updateOrg/:orgId", isOrgAdminLogin, updateOrg)
router.delete("/deleteOrg/:orgId", isOrgAdminLogin, deleteOrg)
router.get("/org/:orgId", org)
router.get("/allOrgs", allOrgs)

router.get('/org/:orgId/org-current-member', orgCurrentMember)
router.post("/org/:orgId/add-member", isOrgAdminLogin, addMember)
router.delete("/org/:orgId/remove-member/:memberId", isOrgAdminLogin, removeMember)

export default router