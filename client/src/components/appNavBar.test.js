import { render, screen, cleanup, } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { Provider } from "react-redux"
import '@testing-library/jest-dom'
import { expect } from "@jest/globals"
import configureMockStore from 'redux-mock-store'

import AppNavbar from "./appNavbar.js"
import textLabelsEN from "./resources/textLabelsEN.js"
import { appStates } from "../store/features/appState.js"


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

const secondState = {
    user: {
        value: {
            _id: "61e59cdb90c58876a5f6b733",
            created: Date.parse("2022-01-17T16:44:11.224Z"),
            name: '',
            familyname: "Pupkin",
            companyname: '',
            position: '',
            portalrole: "Developer",
            rating: 0,
            email: 'v.pupkin@gmail.com',
            phone: '',
            address: '',
            description: ''
        }
    },
    appState: { value: { state: 'WELCOMESCREEN' } }
}

describe("AppNavbar component unit test", () => {

    const middleware = []
    const mockStore = configureMockStore(middleware)
    const storeTest1 = mockStore(() => initialState)
    const storeTest2 = mockStore(() => secondState)

    test("Component to contain objects NO USER state big screen", () => {

        global.innerWidth = 1300

        render(
            <Provider store={storeTest1}>
                <AppNavbar />
            </Provider>)

        const menuButton = screen.getByRole("button", { name: "menuButton" })
        const aboutServiceButton = screen.getByText(textLabelsEN.aboutWebsiteLink)
        const menuLogIn = screen.getByText(textLabelsEN.menuLogIn)
        const menuRegister = screen.getByText(textLabelsEN.menuRegister)
        const appName = screen.getByText(textLabelsEN.appName)

        // checking that all the components are in the document
        expect(menuButton).toBeInTheDocument()
        expect(aboutServiceButton).toBeInTheDocument()
        expect(menuLogIn).toBeInTheDocument()
        expect(menuRegister).toBeInTheDocument()
        expect(appName).toBeInTheDocument()

        //cheking that app name is visible on a wide screen
        expect(appName).toBeVisible()

        //checking menu items to be not visible before menu button click
        expect(menuLogIn).not.toBeVisible()
        expect(menuRegister).not.toBeVisible()

        //menu button click
        userEvent.click(menuButton)

        //checking menu items to be visible after menu button click
        expect(menuLogIn).toBeVisible()
        expect(menuRegister).toBeVisible()

        //checking login button
        userEvent.click(menuButton)
        userEvent.click(menuLogIn)
        let actions = storeTest1.getActions()

        expect(actions[0].type).toEqual("appState/changeState")
        expect(actions[0].payload.state).toEqual(appStates.LOGIN)

        storeTest1.clearActions()

        // checking register button
        userEvent.click(menuButton)
        userEvent.click(menuRegister)
        actions = storeTest1.getActions()

        expect(actions[0].type).toEqual("appState/changeState")
        expect(actions[0].payload.state).toEqual(appStates.REGISTER)

        storeTest1.clearActions()

        cleanup()
    })

    test("Component to contain objects USER AUTHORIZED state small screen", () => {

        global.innerWidth = 500
        global.dispatchEvent(new Event('resize'))

        render(
            <Provider store={storeTest2}>
                <AppNavbar />
            </Provider>)

        const menuButton = screen.getByRole("button", { name: "menuButton" })
        const menuToTheApp = screen.getByText(textLabelsEN.menuToTheApp)
        const menuSettings = screen.getByText(textLabelsEN.menuSettings)
        const menuProfile = screen.getByText(textLabelsEN.menuProfile)
        const menuLogOut = screen.getByText(textLabelsEN.menuLogOut)
        const appName = screen.getByText(textLabelsEN.appName)

        // checking that all the components are in the document
        expect(menuButton).toBeInTheDocument()
        expect(menuToTheApp).toBeInTheDocument()
        expect(menuSettings).toBeInTheDocument()
        expect(menuProfile).toBeInTheDocument()
        expect(menuLogOut).toBeInTheDocument()
        expect(appName).toBeInTheDocument()

        //cheking that app name is NOT visible on a smartphone screenw
        // expect(appName).not.toBeVisible() -- is confirmed to have a bug

        // checking menu items to be not visible before menu button click
        expect(menuToTheApp).not.toBeVisible()
        expect(menuSettings).not.toBeVisible()
        expect(menuProfile).not.toBeVisible()
        expect(menuLogOut).not.toBeVisible()

        // menu button click
        userEvent.click(menuButton)

        // checking menu items to be visible after menu button click
        expect(menuToTheApp).toBeVisible()
        expect(menuSettings).toBeVisible()
        expect(menuProfile).toBeVisible()
        expect(menuLogOut).toBeVisible()

        // checking to app button
        userEvent.click(menuButton)
        userEvent.click(menuToTheApp)
        let actions = storeTest2.getActions()

        expect(actions[0].type).toEqual("appState/changeState")
        expect(actions[0].payload.state).toEqual(appStates.APPMAIN)

        storeTest2.clearActions()

        // checking settings button
        userEvent.click(menuButton)
        userEvent.click(menuSettings)
        actions = storeTest2.getActions()

        expect(actions[0].type).toEqual("appState/changeState")
        expect(actions[0].payload.state).toEqual(appStates.SETTINGS)

        storeTest2.clearActions()

        // checking profile button
        userEvent.click(menuButton)
        userEvent.click(menuProfile)
        actions = storeTest2.getActions()

        expect(actions[0].type).toEqual("appState/changeState")
        expect(actions[0].payload.state).toEqual(appStates.PROFILE)

        storeTest2.clearActions()

        // checking logout button
        userEvent.click(menuButton)
        userEvent.click(menuLogOut)
        actions = storeTest2.getActions()

        expect(actions[0].type).toEqual("user/logout")
        expect(actions[1].type).toEqual("appState/changeState")
        expect(actions[1].payload.state).toEqual(appStates.LOGIN)

        storeTest2.clearActions()

        cleanup()
    })
})