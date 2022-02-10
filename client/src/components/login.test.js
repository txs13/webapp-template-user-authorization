import { render, screen, cleanup, waitFor, } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { Provider } from "react-redux"
import '@testing-library/jest-dom'
import { expect, describe, test, jest, beforeEach, afterEach } from "@jest/globals"
import configureMockStore from 'redux-mock-store'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import Login from "./login.js"
import textLabelsEN from "./resources/textLabelsEN.js"
import { appStates } from "../store/features/appState.js"
import { SERVER_URL, SERVER_PORT, USERS_API } from '../settings/network.js'

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

const resolvedObject = {
    
        success: true,
        user: {
            _id: "61e59cdb90c58876a5f6b733",
            familyname: "Pupkin",
            portalrole: "Developer",
            rating: 0,
            email: "v.pupkin@gmail.com",
            created: "2022-01-17T16:44:11.224Z",
            __v: 0
        },
        token: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MWU1OWNkYjkwYzU4ODc2YTVmNmI3MzMiLCJpYXQiOjE2NDQ0MzQzMTAsImV4cCI6MTY0NDQzNDkxMH0.ujs7sGT25TBKe54AvIiVTRgLCKuMwcUTesA_AQGFk8UoYmgnlgYJpqs-BzEbbUMl9w9TiPXKzd4IsEt9P1nhwUaEHEMuqR7W5Jbvn_vTUn8Yl0FDMHxla46ywmTVTajBRmNm5264rs4GnE5Xk92FYK0MuHJcC-QlnoT6DeBVNFsQXo7GiLo192pLvrdJDbue7i1cN9n69W3Np0iVU_IUDi6HLJzPlxcWyodEqNjJoj6cMvvpjmP21N_zKYAnGlm7deXtAgj6BeY8_m04CI9l1fujJ9PwJoPPYU1EFtker05m7SWZZ-iZlSgktLKtv_q5zBZkh3JiVJHrG_i0RpHbdBhusmIi88C_oNqhWBbGTK-FCjLOA9mJ-3fXZzm3KpH2iZuSu5NWimLpNZuNUIFMs6SvEVGxcOpOu5p_pRLHGbnk2Yh-FysxEdF4gprwkHRKffpSJujnIUDEt3evgUKzNiwjA3qmLxpRFOsv9FoDLCaev25FuC_h502coAy5Rj-XTh0Cnj_Qk03MNd7oxEiUbWQ-BDENzOX4yzDx4h8GoSwH1UKp0JWFRU17MZZm01R8K5jc7IgPVK8jzvFQJiBSUbvb5YHIaKPsuRGVhkggXUzr0YUwXkDYWwnwD4MEk9NEZ0OtI3frP133FGRu_ycIfQFt6hwd45xwEA8ADv_ige4",
        expiresIn: 600
    
}

const rejectedObject =  {
        status: false,
        msg: "wrong password"
    }

var mock = new MockAdapter(axios)
//jest.mock("axios")

mock.onPost(`${USERS_API}/login`).reply((config) => {
    const userData = JSON.parse(config.data)
    if(userData["password"] === "11111111") {
        return [200, resolvedObject]
    } else {
        return [500, rejectedObject]
    }
})


//mock.onPost(`${USERS_API}/login`, {email: "v.pupkin@gmail.com", password: "11111111"})
//    .reply(200, resolvedObject)

//mock.onPost(`${USERS_API}/login`, { email: "v.pupkin@gmail.com", password: "22222222" })
//    .reply(500, rejectedObject)

describe("Login component unit test", () => {

    beforeEach(() => {
        // axios.post.mockImplementation((url, user, options) => {

        //     if (user.password === "11111111") {
        //         //return new Promise(resolve => resolve(resolvedObject))
        //         return Promise.resolve(resolvedObject)
        //     } else {
        //         //return new Promise(reject => reject(rejectedObject))
        //         return Promise.reject(new Error(rejectedObject))
        //     }
        // })

    })

    afterEach(jest.clearAllMocks)

    const middleware = []
    const mockStore = configureMockStore(middleware)
    const store = mockStore(() => initialState)

    test("Component to contain objects", async () => {

        
        render(
            <Provider store={store}>
                <Login client={axios} />
            </Provider>)

        const appName = screen.getByText(textLabelsEN.appName)
        const emailInput = screen.getByLabelText(textLabelsEN.emailEntry)
        const passwordInput = screen.getByLabelText(textLabelsEN.passwordEntry)
        const rememberCheckBox = screen.getByLabelText(textLabelsEN.rememberMeCheckBox)
        const loginButton = screen.getByText(textLabelsEN.loginButton)
        const registerButton = screen.getByText(textLabelsEN.registerButton)

        // checking that all components are in place
        expect(appName).toBeInTheDocument()
        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(rememberCheckBox).toBeInTheDocument()
        expect(loginButton).toBeInTheDocument()
        expect(registerButton).toBeInTheDocument()

        // checking email validation handling

        //entered email and password are empty
        userEvent.click(loginButton)
        let emailValidationMsg = screen.getByText(textLabelsEN.enterYourEmail)
        let passwordValidationMsg = screen.getByText(textLabelsEN.enterYourPassword)

        expect(emailValidationMsg).toBeInTheDocument()
        expect(passwordValidationMsg).toBeInTheDocument()

        //entered email is too short
        userEvent.type(emailInput, "abc")
        userEvent.click(passwordInput)

        expect(emailValidationMsg.textContent).toEqual(textLabelsEN.emailIsTooShort)

        userEvent.clear(emailInput)

        //entered email has wrong format
        userEvent.type(emailInput, "abcdefg.com")
        userEvent.click(passwordInput)

        expect(emailValidationMsg.textContent).toEqual(textLabelsEN.emailWrongFormat)

        userEvent.clear(emailInput)

        //entered email & correct password are properly submitted with login click

        userEvent.type(emailInput, "v.pupkin@gmail.com")
        userEvent.type(passwordInput, "11111111")
        userEvent.click(loginButton)
        // this is to check that post request (caused by login button) was sent corretly
        await waitFor(() => {
            expect(mock.history.post[0].data).toBe(JSON.stringify({ "email": "v.pupkin@gmail.com", "password": "11111111" }))
        })
        // to check that in case of successfull login right commands are dispatched
        let actions = store.getActions()
        expect(actions[0].type).toEqual("user/login")
        expect(actions[0].payload.user).toMatchObject(resolvedObject.user)
        expect(actions[1].type).toEqual("appState/changeState")
        expect(actions[1].payload.state).toEqual(appStates.APPMAIN)

        store.clearActions()
        userEvent.clear(emailInput)
        userEvent.clear(passwordInput)

        //entered email & wrong password are properly submitted with login click

        userEvent.type(emailInput, "v.pupkin@gmail.com")
        userEvent.type(passwordInput, "22222222")
        userEvent.click(loginButton)
        // this is to check that post request (caused by login button) was sent corretly
        await waitFor(() => {
            expect(mock.history.post[1].data).toBe(JSON.stringify({ "email": "v.pupkin@gmail.com", "password": "22222222" }))
        })

        const loginAlert = screen.getByTestId("loginAlertId")
        expect(loginAlert).toBeInTheDocument()

        // this is to check that in case of not successfull login appears alert banner with 
        // proper message
        await waitFor(() => {
            expect(loginAlert.textContent).toContain(textLabelsEN.wrongPasswordMsg || textLabelsEN.otherErrorMsg)
        })

        store.clearActions()

        //registered button is clicked
        userEvent.click(registerButton)
        actions = store.getActions()

        expect(actions[0].type).toEqual("appState/changeState")
        expect(actions[0].payload.state).toEqual(appStates.REGISTER)

        store.clearActions()

        cleanup()
    })
})