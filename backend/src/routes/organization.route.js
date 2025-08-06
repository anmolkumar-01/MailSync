import {Router} from 'express'
import { verifyJWT, isOrgAdminLogin } from '../middlewares/auth.middleware.js'

import{
    createOrg,
    updateOrg,
    deleteOrg,
    allOrgs,
    allMembers,
    orgCurrentMember,
    inviteMember,
    removeMember,
    changeRole,
} from "../controllers/organization.controller.js"

const router = Router()

router.use(verifyJWT)

router.post("/createOrg" , createOrg)
router.put("/updateOrg/:orgId", isOrgAdminLogin, updateOrg)
router.delete("/deleteOrg/:orgId", isOrgAdminLogin, deleteOrg)
router.get("/allOrgs", allOrgs)

router.get('/:orgId/all-members', allMembers)
router.get('/:orgId/org-current-member', orgCurrentMember)
router.post("/:orgId/invite-member", isOrgAdminLogin, inviteMember)
router.delete("/:orgId/remove-member/:memberId", isOrgAdminLogin, removeMember)
router.put("/:orgId/change-role", isOrgAdminLogin, changeRole)

export default router