// sometimes e2e tests are hanging - I suggest due to the jest, puppeteer experimental
// features activated in order these to work with ES6 / "module" node option
// if test fails, just reboot your machine and try it once more before hunting bugs :)

// another rpuppeteer bug I had to address is skipping first symbol entering first password
// if you have updated version of puppeteer without this bug, DO NOT FORGET TO REMOVE THIS FIX

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import '../models/User.js'

dotenv.config()
const DB_NAME = process.env.DB_NAME || "webapp_template"
const connectionString = process.env.DEV_DB_URL

await mongoose.connect(connectionString,
    {
        dbName: DB_NAME
    })

const Users = mongoose.model('Users')

const newUser = {
    email: "noname2@noname.com",
    password: "1!qQwerty",
    familyname: "Pupkin",
}

describe("whole website e2e test", () => {

    test("checking initial page", async () => {
        // open app website
        await page.goto("http://localhost:5000")

        // checking html file settings - app name
        const pageTitle = await page.mainFrame().title()
        expect(pageTitle).toBe("Webapp template")

        // checking that the first form to load with correct size is welcome screen
        const welcomeFormFrame = await page.evaluateHandle(() => document.getElementById("welcome-form-frame"))
        const welcomeFormFrameBox = await welcomeFormFrame.boundingBox()
        expect([350, 400]).toContain(welcomeFormFrameBox.width)
        expect([470, 500]).toContain(welcomeFormFrameBox.height)
        // waiting a couple of seconds welcome form to chenge to login form
        await page.waitForTimeout(2000)

        // checking that login form was loaded with correct size 
        const loginFormHeader = await page.evaluateHandle(() => document.getElementById("login-form-header"))
        const loginFormFrame = await page.evaluateHandle(() => document.getElementById("login-form-frame"))

        expect(await (await loginFormHeader.getProperty("innerText")).jsonValue()).toBe("Webapp template")
        const loginFormFrameBox = await loginFormFrame.boundingBox()
        expect([350, 400]).toContain(loginFormFrameBox.width)
        expect([470, 500]).toContain(loginFormFrameBox.height)

        // checking that cookies infobox is visible when site is first loaded and not visible after
        // user confirmes and clicks CLOSE button
        const cookiesCloseBtn = await page.evaluateHandle(() => document.getElementById('cookies-btn'))
        const cookiesText = await page.evaluateHandle(() => document.getElementById('cookies-text'))

        let cookiesCloseBtnBox = await cookiesCloseBtn.boundingBox()
        let cookiesTextBox = await cookiesText.boundingBox()
        expect(cookiesCloseBtnBox).not.toBeNull()
        expect(cookiesTextBox).not.toBeNull()
        cookiesCloseBtnBox = undefined
        cookiesTextBox = undefined

        await cookiesCloseBtn.click()

        cookiesCloseBtnBox = await cookiesCloseBtn.boundingBox()
        cookiesTextBox = await cookiesText.boundingBox()
        expect(cookiesCloseBtnBox).toBeNull()
        expect(cookiesTextBox).toBeNull()

        // checking that after user clicks CLOSE button, proper information is stored in cookies
        const cookies = await page.cookies()
        const cookiesCookies = cookies.filter(it =>
            it.name === "cookiesConfirmed"
            && it.path === "/"
            && it.value === "confirmed")
        expect(cookiesCookies.length).toBe(1)

    }, 15000)

    test("register new user", async () => {
        // open app website
        await page.goto("http://localhost:5000")

        // checking html file settings - app name
        const pageTitle = await page.mainFrame().title()
        expect(pageTitle).toBe("Webapp template")

        // waiting a couple of seconds welcome form to chenge to login form
        await page.waitForTimeout(2000)

        // looking for register button and navigating to register form
        const toRegisterBtn = await page.evaluateHandle(() => document.getElementById("login-form-register-btn"))
        expect(await (await toRegisterBtn.getProperty("innerText")).jsonValue()).toBe("REGISTER")
        await toRegisterBtn.click()

        // checking that we successfully navigated to register form and correct info message is shown
        const registerInfo = await page.evaluateHandle(() => document.getElementById("register-form-info"))
        expect(await (await registerInfo.getProperty("innerText")).jsonValue()).toBe("password: 8-16 characters, minimum one digit, one special, one lower and upper case letter")

        // getting links to all the entries and entering user data
        const emailEntry = await page.evaluateHandle(() => document.getElementById("register-form-email-entry"))
        const passwordEntry = await page.evaluateHandle(() => document.getElementById("register-form-password-entry"))
        const secondPasswordEntry = await page.evaluateHandle(() => document.getElementById("register-form-second-password-entry"))
        const familynameEntry = await page.evaluateHandle(() => document.getElementById("register-form-familyname-entry"))
        const roleEntry = await page.evaluateHandle(() => document.getElementById("register-form-role-entry"))
        const registerBtn = await page.evaluateHandle(() => document.getElementById("register-form-register-btn"))

        await emailEntry.focus()
        await emailEntry.type(newUser.email)
        await passwordEntry.focus()
        // this is the only temporary bugfix I managed to find for the issue
        // somewhy puppeteer skips the first symbol entering password, therefore
        // I had to add empty symbol to overcome this puppeteer bug
        await passwordEntry.type(` ${newUser.password}`, { delay: 100 })
        await page.waitForSelector(`#register-form-password-entry[value="${newUser.password}"]`);
        await page.waitForTimeout(500)
        await secondPasswordEntry.focus()
        await secondPasswordEntry.type(newUser.password, { delay: 100 })
        await page.waitForSelector(`#register-form-second-password-entry[value="${newUser.password}"]`);
        await page.waitForTimeout(500)
        await familynameEntry.focus()
        await familynameEntry.type(newUser.familyname)
        // in order to select the role we first click on the role input, then we look for
        // available option and select one of them
        await roleEntry.focus()
        await roleEntry.press("Enter")
        await page.waitForTimeout(2000)
        const devOptionEntry = await page.evaluateHandle(() => document.getElementById("register-form-role-developer"))
        const reqOptionEntry = await page.evaluateHandle(() => document.getElementById("register-form-role-recruiter"))
        await page.waitForTimeout(500)
        await devOptionEntry.click()
        // submitting the data - registering new user
        await page.waitForTimeout(2000)

        await registerBtn.click()

        await page.waitForTimeout(2000)

        // checking that user was successfully created and app navigated to the login screen
        const loginFormHeader = await page.evaluateHandle(() => document.getElementById("login-form-header"))
        const loginFormFrame = await page.evaluateHandle(() => document.getElementById("login-form-frame"))

        expect(await (await loginFormHeader.getProperty("innerText")).jsonValue()).toBe("Webapp template")
        const loginFormFrameBox = await loginFormFrame.boundingBox()
        expect([350, 400]).toContain(loginFormFrameBox.width)
        expect([470, 500]).toContain(loginFormFrameBox.height)

    }, 25000)

    test("login test", async () => {
        // open app website
        await page.goto("http://localhost:5000")

        // checking html file settings - app name
        const pageTitle = await page.mainFrame().title()
        expect(pageTitle).toBe("Webapp template")

        // waiting a couple of seconds welcome form to chenge to login form
        await page.waitForTimeout(2000)

        // getting login form elements
        const loginBtn = await page.evaluateHandle(() => document.getElementById("login-form-login-btn"))
        expect(await (await loginBtn.getProperty("innerText")).jsonValue()).toBe("LOG IN")

        let emailEntry = await page.evaluateHandle(() => document.getElementById("login-form-email-entry"))
        const passwordEntry = await page.evaluateHandle(() => document.getElementById("login-form-password-entry"))

        // filling login credentials
        await emailEntry.focus()
        await emailEntry.type(newUser.email)
        await page.waitForSelector(`#login-form-email-entry[value="${newUser.email}"]`)
        await page.waitForTimeout(500)

        await passwordEntry.focus()
        await passwordEntry.type(newUser.password)
        await page.waitForSelector(`#login-form-password-entry[value="${newUser.password}"]`)
        await page.waitForTimeout(500)

        // attempting to log in
        await loginBtn.click()

        await page.waitForTimeout(2000)

        // checking that user was successfully logged in
        const mainAppFrame = await page.evaluateHandle(() => document.getElementById("main-app-frame"))
        const mainAppFrameText = await (await mainAppFrame.getProperty("innerText")).jsonValue()
        expect(mainAppFrameText).toBe("MAIN APP FRAME")

        // checking cookies

        const cookies = await page.cookies()

        const emailSplit = newUser.email.split("@")
        // checking that user email is stored in cookies properly
        const loginCookies = cookies.filter(it =>
            it.name === "email"
            && it.path === "/"
            && it.value === `${emailSplit[0]}%40${emailSplit[1]}`)
        expect(loginCookies.length).toBe(1)
        // checking that JWT token is stored in cookies properly
        const jwtTokenCookies = cookies.filter(it =>
            it.name === "token"
            && it.path === "/"
            && it.value !== "")
        expect(jwtTokenCookies.length).toBe(1)

        // accessing menu and logging out
        const navMenu = await page.evaluateHandle(() => document.getElementById("navbar-menu-icon"))

        await navMenu.focus()
        await navMenu.press('Enter')
        await page.waitForTimeout(2000)

        const logOut = await page.evaluateHandle(() => document.getElementById("navbar-menu-item-logout"))
        expect(await (await logOut.getProperty("innerText")).jsonValue()).toBe("Log out")

        await logOut.click()

        await page.waitForTimeout(2000)

        // checking that user was successfully created and app navigated to the login screen
        const loginFormHeader = await page.evaluateHandle(() => document.getElementById("login-form-header"))
        const loginFormFrame = await page.evaluateHandle(() => document.getElementById("login-form-frame"))

        expect(await (await loginFormHeader.getProperty("innerText")).jsonValue()).toBe("Webapp template")
        const loginFormFrameBox = await loginFormFrame.boundingBox()
        expect([350, 400]).toContain(loginFormFrameBox.width)
        expect([470, 500]).toContain(loginFormFrameBox.height)

        // checking remembered emeil in login input
        emailEntry = undefined
        emailEntry = await page.evaluateHandle(() => document.getElementById("login-form-email-entry"))

        expect(await (await emailEntry.getProperty("value")).jsonValue()).toBe(newUser.email)

        // database cleanup  - deleting temporary user

        await Users.findOneAndDelete({ email: newUser.email })

        await page.waitForTimeout(4000)

    }, 15000)

})