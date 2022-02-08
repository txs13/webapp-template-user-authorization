import mongoose from 'mongoose'
import express from 'express'
import passport from 'passport'
import { userRolesConst } from '../config/initializeDB.js'
import { genPassword, validatePassword, issueJWT } from '../lib/cryptoUtils.js'

const UserRoles = mongoose.model('UserRoles')
const Users = mongoose.model('Users')
const router = express.Router()

router.get('/', (req, res, next) => {
    UserRoles.find({ public: true })
        .then((userRoles) => {
            res.status(200).json(userRoles)
        })
        .catch((error)=> {
            next(error)
        })
})

router.get('/allRolesAdmin', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    
    if (req.user.portalrole === userRolesConst.Admin.userRole) {
        UserRoles.find()
            .then((roles) => {
                res.status(200).json(roles)
            })
            .catch((error) => {
                console.log(`User roles were read with error ${error}`)
                next(error)
                //res.status(401).json({ status: "failure", msg: "Something went wrong. Please contact site administrator." })
            })
    } else {
        res.status(401).json({ status: "failure", msg: "Access denied. Please contact site administrator." })
    }

})


export default router