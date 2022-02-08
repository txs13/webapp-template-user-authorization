import mongoose from 'mongoose'
import express from 'express'
import passport from 'passport'
import { genPassword, validatePassword, issueJWT } from '../lib/cryptoUtils.js'

const Users = mongoose.model('Users')
const UserRoles = mongoose.model('UserRoles')
const router = express.Router()

router.get('/allUsers', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.send("<h1>Users list is supposed to be provided here for authrized users</h1>")
})

// the idea is to keep jwt token alive only some minutes unless user uses the portal
// therefore every time user does something, he needs to get jwt token with updted lifetime
// this api is exactly to get updated jwt token
router.get('/refresh', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const tokenObject = issueJWT(req.user)
    let userObjetToSend = JSON.parse(JSON.stringify(req.user))
    delete userObjetToSend.hash
    delete userObjetToSend.salt
    res.status(200).json({
        success: true,
        user: userObjetToSend,
        token: tokenObject.token,
        expiresIn: tokenObject.expires
    })
})

// this is the api call to check whether entered email during registration is already used
// returns simple result as true if checked email is available or false in case it is not
router.post('/checkemail', (req, res, next) => {
    Users.find({ email: req.body.email })
        .then((users) => {
            if (users.length === 0) {
                res.status(200).json({ status: "success", isAvailable: "true", msg: "" })
            }
            if (users.length === 1) {
                res.status(200).json({ status: "success", isAvailable: "false", msg: "" })
            }
            if (users.length > 1) {
                res.status(400).json({
                    status: "failure", isAvailable: "",
                    msg: "Please contact site administrator, there is several record with the same emai"
                })
            }

        })
        .catch((err) => {
            res.status(400).json({
                status: "failure", isAvailable: "",
                msg: `Database error ${err}`
            })
        })
})

router.post('/login', (req, res, next) => {
    Users.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                res.status(401).json({ status: false, msg: "could not find user" })
            } else {
                const isValid = validatePassword(req.body.password, user.hash, user.salt)
                if (isValid) {
                    const tokenObject = issueJWT(user)
                    let userObjetToSend = JSON.parse(JSON.stringify(user))
                    delete userObjetToSend.hash
                    delete userObjetToSend.salt
                    res.status(200).json({
                        success: true,
                        user: userObjetToSend,
                        token: tokenObject.token,
                        expiresIn: tokenObject.expires
                    })
                } else {
                    res.status(400).json({ status: false, msg: "wrong password" })
                }
            }
        })
        .catch((error) => {
            next(error)
        })
})

router.post('/register', (req, res, next) => {
    const newUser = req.body

    Users.findOne({ email: newUser.email })
        .then((user) => {
            if (user) {
                res.status(400).json({ status: false, msg: "User with this email is already registered!" })
            } else {
                // the idea is to avoid the situation when someone sets manually put request with
                // role name "admin" trying to get admin permissions.
                // For this purpose exactly role id is checked here and right role name is extracted
                // the logic is that the one who has no access to admin role id anyway cannot
                // create admin user
                UserRoles.findOne({ _id: newUser.role })
                    .then((role) => {
                        if (role) {
                            const password = genPassword(newUser.password)
                            const newUserEntry = new Users({
                                portalrole: role.userRole,
                                hash: password.hash,
                                salt: password.salt,
                                familyname: newUser.familyname,
                                email: newUser.email
                            })
                            newUserEntry.save()
                                .then(() => {
                                    console.log(`User ${newUser.email} is created`)
                                    res.status(201).json({ status: true, msg: "User successfully created" })
                                })
                                .catch((error) => {
                                    console.log(error)
                                    res.status(400).json({ status: false, msg: "database error" })
                                })
                        } else {
                            res.status(400).json({ status: false, msg: "Wrong role ID!" })
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        res.status(400).json({ status: false, msg: "database error" })
                    })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(400).json({ status: false, msg: "database error" })
        })
})



export default router