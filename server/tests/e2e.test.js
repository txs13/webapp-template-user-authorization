// sometimes e2e tests are hanging - I suggest due to the jest, puppeteer experimental
// features activated in order these to work with ES6 / "module" node option
// if test fails, just reboot your machine and try it once more before hunting bugs :)

const newUser = {
    email: "noname@noname.com",
    password: "12345678",
    familyname: "Pupkin",
}

describe("whole website e2e test", () => {

    test("initial page loading", async () => {
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

        expect(await(await loginFormHeader.getProperty("innerText")).jsonValue()).toBe("Webapp template")
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

    }, 10000)

    test("register new user", () => {

    })

    test("login test", () => {

    })

    afterAll(() => {

    })

})