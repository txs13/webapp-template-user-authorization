import { render, screen, cleanup } from "@testing-library/react"
import '@testing-library/jest-dom'
import { expect } from "@jest/globals"

import Welcome from "./welcome.js"
import textLabelsEN from "./resources/textLabelsEN.js"

describe("Welcome component unit test", () => {
    test("Component to contain objects", () => {
        render(<Welcome />)
        const appName = screen.getByText(textLabelsEN.appName)
        expect(appName).toBeInTheDocument()
        cleanup()
    })
})