import { findSourceMap } from 'module'
import mongoose from 'mongoose'
import { issueJWT, genPassword, validatePassword } from '../lib/cryptoUtils.js'

export const userRolesConst = {
    Admin: {
        userRole: "Admin",
        public: false
    },
    Developer: {
        userRole: "Developer",
        public: true
    },
    Recruiter: {
        userRole: "Recruiter",
        public: true
    },
}

const Users = mongoose.model("Users")
const UserRoles = mongoose.model("UserRoles")

UserRoles.find()
    .then((userRoles) => {
        if (userRoles.length === 0) {
            UserRoles.insertMany([
                new UserRoles({
                    userRole: userRolesConst.Admin.userRole,
                    public: userRolesConst.Admin.public
                }),
                new UserRoles({
                    userRole: userRolesConst.Developer.userRole,
                    public: userRolesConst.Developer.public
                }),
                new UserRoles({
                    userRole: userRolesConst.Recruiter.userRole,
                    public: userRolesConst.Recruiter.public
                })]
            )
                .then(() => {
                    console.log('Standard user roles created')
                })
                .catch((error) => {
                    console.log(`Standard user roles initalization failed with the error ${error}`);
                })
        } else {
            if (userRoles[0].userRole === userRolesConst.Admin.userRole &&
                userRoles[0].public === userRolesConst.Admin.public &&
                userRoles[1].userRole === userRolesConst.Developer.userRole &&
                userRoles[1].public === userRolesConst.Developer.public &&
                userRoles[2].userRole === userRolesConst.Recruiter.userRole &&
                userRoles[2].public === userRolesConst.Recruiter.public
            ) {
                console.log('Standard user roles checked - OK')
            } else {
                console.log('Your user roles table / document is corrupted, please check!')
            }
        }
    })
    .catch((error) => {
        console.log(`Standard user roles check failed with the error ${error}`)
    })

Users.find({ portalRole: userRolesConst.Admin.userRole })
    .then((admins) => {
        if (admins.length === 0) {
            const passwordText = '12345678'
            const password = genPassword(passwordText)
            const firstAdmin = new Users({
                portalrole: userRolesConst.Admin.userRole,
                hash: password.hash,
                salt: password.salt,
                familyname: "admin familyname",
                email: "admin@yoursite.com"
            })
            firstAdmin.save()
                .then(() => {
                    console.log('Initial admin is created')
                })
                .catch((error) => {
                    console.log(`Initial admin initalization failed with the error ${error}`)
                })
        } else {
            console.log('Admin user checked - OK')
        }
    })
    .catch((error) => {
        console.log(`Admin initialialization failed with the error ${error}`)
    })
