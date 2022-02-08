import express from 'express'
import users from './users.js'
import userRoles from './userRoles.js'

const router = express.Router()

router.use('/users/', users)
router.use('/userroles/', userRoles)

export default router