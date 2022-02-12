import { render, screen, cleanup } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { expect } from "@jest/globals"

import CookiesInfo from "./cookiesInfo.js"
import textLabelsEN from "./resources/textLabelsEN.js"

describe("Cookies confimation component unit test", () => {
    test('Component to contain objects', () => {

        let cookiesConfirmed = false

        const view =
            render(<CookiesInfo confirmCookiesClick={() => { }} cookiesConfirmed={cookiesConfirmed} />)
        const cookiesText = screen.getByText(textLabelsEN.cookiesInfo)
        const cookiesButton = screen.getByText(textLabelsEN.cookiesBtn)
        // element exist in DOM
        expect(cookiesText).toBeInTheDocument()
        expect(cookiesButton).toBeInTheDocument()
        // elements are visible if cookies are not yet confirmed
        expect(cookiesText).toBeVisible()
        expect(cookiesButton).toBeVisible()

        cookiesConfirmed = true
        view.rerender()
        // element are NOT visbile if cookies are already confirmed
        expect(cookiesText).not.toBeVisible()
        expect(cookiesButton).not.toBeVisible()

        cleanup()
    })


    test('Component to react on button click', () => {
        const cookiesConfirmed = false
        const onClickMock = jest.fn()
        render(<CookiesInfo confirmCookiesClick={onClickMock} cookiesConfirmed={cookiesConfirmed} />)
        const cookiesButton = screen.getByText(textLabelsEN.cookiesBtn)
        // checking that onClik property passed fom props to the button correctly
        userEvent.click(cookiesButton)
        expect(onClickMock).toHaveBeenCalled()

        cleanup()
    })

})