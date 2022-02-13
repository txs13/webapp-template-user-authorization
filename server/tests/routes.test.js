import request from 'supertest'
import mongoose from 'mongoose'
import { jest, beforeAll } from '@jest/globals'
const Users = mongoose.model('Users')
const UserRoles = mongoose.model('UserRoles')

import app from '../app.js'

global.console = {
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
}

describe("API tests", () => {

    test("app initailization confirmation console log messages check", done => {
        setTimeout(() => {
            expect(global.console.log).toHaveBeenCalledWith("DB is connected - OK")
            expect(global.console.log).toHaveBeenCalledWith("Admin user checked - OK")
            expect(global.console.log).toHaveBeenCalledWith("Standard user roles checked - OK")
        }, 2000)
        done()

    })

    test("user roles - get public roles", async () => {
        const res = await request(app).get("/api/v1/userroles/")
        expect(res.status).toBe(200)
        const publicRoles = res.body

        const devRoles = publicRoles.filter(it => it.userRole === "Developer")
        const recRoles = publicRoles.filter(it => it.userRole === "Recruiter")
        const admRoles = publicRoles.filter(it => it.userRole === "Admin")
        expect(devRoles.length).toBe(1)
        expect(recRoles.length).toBe(1)
        expect(admRoles.length).toBe(0)
    })

    test("users - login", async () => {
        let loginData = await request(app).post('/api/v1/users/login')
            .send({ email: "admin@yoursite.com", password: "12345678" })
        expect(loginData.body.token).toContain("Bearer")
        expect(loginData.body.user.email).toBe("admin@yoursite.com")
        expect(loginData.body.success).toBe(true)

        loginData = await request(app).post('/api/v1/users/login')
            .send({ email: "admin@yoursite.com", password: "1234567" })
        expect(loginData.body.success).toBe(false)
        expect(loginData.body.msg).toBe("wrong password")

        loginData = await request(app).post('/api/v1/users/login')
            .send({ email: "dmin@yoursite.com", password: "12345678" })
        expect(loginData.body.success).toBe(false)
        expect(loginData.body.msg).toBe("could not find user")
    })

    test("users - register", async () => {
        const publicRoles = await request(app).get("/api/v1/userroles/")
        expect(publicRoles.status).toBe(200)
        const developerRole = [...publicRoles.body.filter(it => it.userRole === "Developer")]
        const newUser = {
            email: "noname@noname.com",
            emailError: "",
            password: "12345678",
            passwordError: "",
            secondPassword: "12345678",
            secondPasswordError: "",
            familyname: "Pupkin",
            familynameError: "",
            role: developerRole[0]._id,
            roleError: "",
            alertMessage: "",
            infoMessage: "",
            submitNewUser: false
        }
        // normal registration with valid user data
        let registerData = await request(app).post("/api/v1/users/register")
            .send(newUser)
        expect(registerData.status).toBe(201)
        expect(registerData.body).toEqual({ success: true, msg: "User successfully created" })
        // trying to register the same user with the same credentials
        registerData = await request(app).post("/api/v1/users/register")
            .send(newUser)
        expect(registerData.status).toBe(400)
        expect(registerData.body).toEqual({ status: false, msg: 'User with this email is already registered!' })
        // cheking that exactly the same user was created with right user data
        let dbUser = await Users.find({ email: newUser.email })
        expect(dbUser.length).toBe(1)
        expect(dbUser[0].email).toBe(newUser.email)
        expect(dbUser[0].familyname).toBe(newUser.familyname)
        expect(dbUser[0].portalrole).toBe(developerRole[0].userRole)
        // database cleanup
        await Users.deleteOne({ _id: dbUser[0]._id })
        dbUser = await Users.find({ email: newUser.email })
        expect(dbUser.length).toBe(0)
        // trying to crate user without email    
        newUser.email = ""
        registerData = await request(app).post("/api/v1/users/register")
            .send(newUser)
        expect(registerData.status).toBe(400)
        expect(registerData.body).toEqual({ success: false, msg: 'database error' })
        // trying to create user with fake Admin portal role
        newUser.email = "noname@noname.com"
        newUser.role = "Admin"
        registerData = await request(app).post("/api/v1/users/register")
            .send(newUser)
        expect(registerData.status).toBe(400)
        expect(registerData.body).toEqual({ success: false, msg: 'database error' })
    })


    test("user roles - get all roles (admin only)", async () => {

        // option #1 - getting roles with admin rights
        let loginData = await request(app).post('/api/v1/users/login')
            .send({ email: "admin@yoursite.com", password: "12345678" })
        expect(loginData.body.token).toContain("Bearer")
        expect(loginData.body.user.email).toBe("admin@yoursite.com")
        expect(loginData.body.success).toBe(true)

        let rolesData = await request(app).get("/api/v1/userroles/allRolesAdmin")
            .set({ Authorization: loginData.body.token })
        expect(rolesData.status).toBe(200)
        const roles = rolesData.body

        const devRoles = roles.filter(it => it.userRole === "Developer")
        const recRoles = roles.filter(it => it.userRole === "Recruiter")
        const admRoles = roles.filter(it => it.userRole === "Admin")
        expect(devRoles.length).toBe(1)
        expect(recRoles.length).toBe(1)
        expect(admRoles.length).toBe(1)

        // option#2 - trying to get data with existing NOT admin user

        const publicRoles = await request(app).get("/api/v1/userroles/")
        expect(publicRoles.status).toBe(200)
        const developerRole = [...publicRoles.body.filter(it => it.userRole === "Developer")]
        const newUser = {
            email: "noname@noname.com",
            emailError: "",
            password: "12345678",
            passwordError: "",
            secondPassword: "12345678",
            secondPasswordError: "",
            familyname: "Pupkin",
            familynameError: "",
            role: developerRole[0]._id,
            roleError: "",
            alertMessage: "",
            infoMessage: "",
            submitNewUser: false
        }
        // normal registration with valid user data
        let registerData = await request(app).post("/api/v1/users/register")
            .send(newUser)
        expect(registerData.status).toBe(201)
        expect(registerData.body).toEqual({ success: true, msg: "User successfully created" })

        loginData = await request(app).post('/api/v1/users/login')
            .send({ email: newUser.email, password: newUser.password })
        expect(loginData.body.token).toContain("Bearer")
        expect(loginData.body.user.email).toBe(newUser.email)
        expect(loginData.body.success).toBe(true)

        rolesData = await request(app).get("/api/v1/userroles/allRolesAdmin")
            .set({ Authorization: loginData.body.token })
        expect(rolesData.status).toBe(401)
        expect(rolesData.body).toEqual({
            status: 'failure',
            msg: 'Access denied. Please contact site administrator.'
        })

        // cheking that exactly the same user was created with right user data
        let dbUser = await Users.find({ email: newUser.email })
        expect(dbUser.length).toBe(1)
        expect(dbUser[0].email).toBe(newUser.email)
        expect(dbUser[0].familyname).toBe(newUser.familyname)
        expect(dbUser[0].portalrole).toBe(developerRole[0].userRole)
        // database cleanup
        await Users.deleteOne({ _id: dbUser[0]._id })
        dbUser = await Users.find({ email: newUser.email })
        expect(dbUser.length).toBe(0)

    })
})