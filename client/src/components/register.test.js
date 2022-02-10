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
    return [201, { status: true, msg: "User successfully created" }]
    // res.status(400).json({ status: false, msg: "User with this email is already registered!" })
})

mock.onPost(`${USERS_API}/checkemail`).reply((config) => {
    const userData = JSON.parse(config.data)
    return [200, { status: "success", isAvailable: "true", msg: "" }]
    // res.status(200).json({ status: "success", isAvailable: "false", msg: "" })
})

describe ("Register component unit test", () => {
    
    afterEach(jest.clearAllMocks)

    const middleware = []
    const mockStore = configureMockStore(middleware)
    const store = mockStore(() => initialState)

    test("Component to contain objects", () => {
        render(
            <Provider store={store}>
                <Register client={axios} roles={roles} />
            </Provider>)

        // some tests are to be implemented here later on
    })
})