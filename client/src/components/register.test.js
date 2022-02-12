import { render, screen, cleanup, waitFor, } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { Provider } from "react-redux"
import '@testing-library/jest-dom'
import { expect, describe, test, jest, beforeEach, afterEach } from "@jest/globals"
import configureMockStore from 'redux-mock-store'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import Register from "./register.js"
import textLabelsEN from "./resources/textLabelsEN.js"
import { appStates } from "../store/features/appState.js"
import { USERS_API } from '../settings/network.js'

const initialState = {
    user: {
        value: {
            _id: null,
            created: null,
            name: '',
            familyname: '',
            companyname: '',
            position: '',
            portalrole: '',
            rating: 0,
            email: '',
            phone: '',
            address: '',
            description: ''
        }
    },
    appState: { value: { state: 'WELCOMESCREEN' } }
}

const roles = [
    {
        _id: "61d2d9dbd1cdb5ccceca7395",
        userRole: "Developer",
        public: true,
        __v: 0
    },
    {
        _id: "61d2d9dbd1cdb5ccceca7396",
        userRole: "Recruiter",
        public: true,
        __v: 0
    }
]

var mock = new MockAdapter(axios)

mock.onPost(`${USERS_API}/register`).reply((config) => {
    const userData = JSON.parse(config.data)
    if (userData.email === "noname@noname.com") {
        return [400, { status: false, msg: "User with this email is already registered!" }]
    }

    return [201, { status: true, msg: "User successfully created" }]

})

mock.onPost(`${USERS_API}/checkemail`).reply((config) => {
    const userData = JSON.parse(config.data)
    if (userData.email === "admin@yoursite.com") {
        return [200, { status: "success", isAvailable: "false", msg: "" }]
    }
    return [200, { status: "success", isAvailable: "true", msg: "" }]
})

describe("Register component unit test", () => {

    afterEach(jest.clearAllMocks)

    const middleware = []
    const mockStore = configureMockStore(middleware)
    const store = mockStore(() => initialState)

    test("Component to contain objects", async () => {
        render(
            <Provider store={store}>
                <Register client={axios} roles={roles} />
            </Provider>)

        // to ckeck that all the items are in place
        const appName = screen.getByText(textLabelsEN.appName)
        const infoBox = screen.getByTestId("infoAlertId")
        const alertBox = screen.getByTestId("loginAlertId")
        const emailEntry = screen.getByLabelText(textLabelsEN.emailEntry)
        const passwordEntry = screen.getByLabelText(textLabelsEN.passwordEntry)
        const secondPasswordEntry = screen.getByLabelText(textLabelsEN.repeatPasswordEntry)
        const familynameEntry = screen.getByLabelText(textLabelsEN.familynameEntry)
        const roleEntry = screen.getByLabelText(textLabelsEN.roleEntry)
        const backToLoginBtn = screen.getByText(textLabelsEN.backToLoginBtn)
        const createUserBtn = screen.getByText(textLabelsEN.createUserBtn)

        expect(appName).toBeVisible()
        expect(infoBox).toBeVisible()
        expect(alertBox).not.toBeVisible()
        expect(emailEntry).toBeVisible()
        expect(passwordEntry).toBeVisible()
        expect(secondPasswordEntry).toBeVisible()
        expect(familynameEntry).toBeVisible()
        expect(roleEntry).toBeVisible()
        expect(backToLoginBtn).toBeVisible()
        expect(createUserBtn).toBeVisible()

        // to get all the input fields messages
        userEvent.type(passwordEntry, "1")
        userEvent.type(secondPasswordEntry, "2")
        userEvent.click(createUserBtn)

        let emailEntryMsg = screen.getByText(textLabelsEN.enterYourEmailMsg)
        let passwordEntryMsg = screen.getByText(textLabelsEN.passwordIsShortMsg)
        let secondPasswordEntryMsg = screen.getByText(textLabelsEN.secondPasswordNotMatchMsg)
        let familynameMsg = screen.getByText(textLabelsEN.enterYourNameMsg)
        let roleEntryMsg = screen.getByText(textLabelsEN.chooseRoleMsg)

        expect(emailEntryMsg).toBeVisible()
        expect(passwordEntryMsg).toBeVisible()
        expect(secondPasswordEntryMsg).toBeVisible()
        expect(familynameMsg).toBeVisible()
        expect(roleEntryMsg).toBeVisible()
        expect(infoBox).not.toBeVisible()
        expect(alertBox).not.toBeVisible()

        // reset all fileds
        userEvent.clear(emailEntry)
        userEvent.clear(passwordEntry)
        userEvent.clear(secondPasswordEntry)
        userEvent.clear(familynameEntry)

        // check role options availability and setting developer option
        userEvent.click(roleEntry)
        let optionDev = screen.getByText("Developer")
        let optionRec = screen.getByText("Recruiter")

        expect(optionDev).toBeVisible()
        expect(optionRec).toBeVisible()

        userEvent.click(optionDev)

        expect(roleEntry.textContent).toContain("Developer")

        // checking the correctness of the one of email validation messages
        expect(emailEntryMsg).not.toBeVisible()

        userEvent.type(emailEntry, "abcdef.com")
        userEvent.click(passwordEntry)

        emailEntryMsg = screen.getByText(textLabelsEN.emailWrongFormatMsg)
        expect(emailEntryMsg).toBeVisible()
        expect(infoBox).not.toBeVisible()
        expect(alertBox).not.toBeVisible()

        userEvent.clear(emailEntry)
        userEvent.click(passwordEntry)
        expect(emailEntryMsg).not.toBeVisible()

        // checking the correctness of the one of password validation messages
        expect(passwordEntryMsg).not.toBeVisible()

        userEvent.type(passwordEntry, "abcdef.com")
        userEvent.click(emailEntry)

        passwordEntryMsg = screen.getByText(textLabelsEN.passwordWrongFormatMsg)
        expect(passwordEntryMsg).toBeVisible()
        expect(infoBox).not.toBeVisible()
        expect(alertBox).not.toBeVisible()

        userEvent.clear(passwordEntry)
        userEvent.click(emailEntry)
        expect(passwordEntryMsg).not.toBeVisible()

        // checking the correctness of the repeat password validation messages
        // there is only one wrong input message and it is already checked
        // therefore here I am checking only that it is not visible
        expect(secondPasswordEntryMsg).not.toBeVisible()

        // checking the correctness of the one of familyname validation messages
        expect(familynameMsg).not.toBeVisible()

        userEvent.type(familynameEntry, "abcdef.com")
        userEvent.click(emailEntry)

        familynameMsg = screen.getByText(textLabelsEN.nameWrongFormatMsg)
        expect(familynameMsg).toBeVisible()
        expect(infoBox).not.toBeVisible()
        expect(alertBox).not.toBeVisible()

        userEvent.clear(familynameEntry)
        userEvent.click(emailEntry)
        expect(familynameMsg).not.toBeVisible()

        expect(emailEntryMsg).not.toBeVisible()

        userEvent.type(emailEntry, "noname@noname.com")
        userEvent.click(passwordEntry)

        await waitFor(() => {
            expect(mock.history.post[0].data).toBe(JSON.stringify({ "email": "noname@noname.com" }))
        })
        expect(mock.history.post[0].url).toBe(`${USERS_API}/checkemail`)
        expect(emailEntryMsg).not.toBeVisible()
        expect(infoBox).toBeVisible()
        expect(alertBox).not.toBeVisible()

        userEvent.clear(emailEntry)

        // checking that entered email is already used
        expect(emailEntryMsg).not.toBeVisible()

        userEvent.type(emailEntry, "admin@yoursite.com")
        userEvent.click(passwordEntry)

        await waitFor(() => {
            expect(mock.history.post[1].data).toBe(JSON.stringify({ "email": "admin@yoursite.com" }))
        })
        expect(mock.history.post[1].url).toBe(`${USERS_API}/checkemail`)
        expect(mock.history.post.length).toEqual(2)
        emailEntryMsg = screen.getByText(textLabelsEN.emailIsUsedMsg)
        expect(emailEntryMsg).toBeVisible()
        expect(infoBox).not.toBeVisible()
        expect(alertBox).not.toBeVisible()

        userEvent.clear(emailEntry)
        userEvent.click(passwordEntry)
        expect(emailEntryMsg).not.toBeVisible()

        // form is properly filled and submitted, but the feature of being able to try to submit
        // the existing email is used in order to check error alert functionality

        const userData = {
            email: "noname@noname.com",
            password: "1!qQwerty",
            familyname: "Pupkin",
        }

        userEvent.type(passwordEntry, userData.password)
        userEvent.type(secondPasswordEntry, userData.password)
        userEvent.type(familynameEntry, userData.familyname)
        userEvent.type(emailEntry, userData.email)
        userEvent.click(createUserBtn)

        await waitFor(() => {
            // there was a bug when post request went on 2 times - therefore it is very important to
            // keep an eye on the number of request by front-end
            expect(mock.history.post.length).toEqual(4)
        })

        let sentUserData = JSON.parse(mock.history.post[3].data)
        expect(sentUserData.email).toBe(userData.email)
        expect(sentUserData.familyname).toBe(userData.familyname)
        expect(sentUserData.password).toBe(userData.password)
        expect(infoBox).not.toBeVisible()
        expect(alertBox).toBeVisible()
        expect(alertBox.textContent).toContain(textLabelsEN.userExistsAlert)
        let actions = store.getActions()
        expect(actions.length).toBe(0)

        // form is properly filled and submitted
        userData.email = "name@noname.com"
        userEvent.clear(emailEntry)
        userEvent.type(emailEntry, userData.email)
        userEvent.click(createUserBtn)

        await waitFor(() => {
            // there was a bug when post request went on 2 times - therefore it is very important to
            // keep an eye on the number of request by front-end
            expect(mock.history.post.length).toEqual(6)
        })
        
        sentUserData = JSON.parse(mock.history.post[5].data)
        expect(sentUserData.email).toBe(userData.email)
        expect(sentUserData.familyname).toBe(userData.familyname)
        expect(sentUserData.password).toBe(userData.password)
        actions = store.getActions()
        expect(actions.length).toBe(1)
        expect(actions[0].type).toEqual("appState/changeState")
        expect(actions[0].payload.state).toEqual(appStates.LOGIN)

        // to test back to login button
        userEvent.click(backToLoginBtn)
        actions = store.getActions()

        expect(actions[1].type).toEqual("appState/changeState")
        expect(actions[1].payload.state).toEqual(appStates.LOGIN)

        cleanup()
    }, 15000)
})