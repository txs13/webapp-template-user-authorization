import { validateName, validatePassword, validateSecondPassword, validateEmail } from './validationUtils.js'

export const emailTestCases = [
    { email: "", submittingForm: true, expectedResult: "please enter your email" },
    { email: "", submittingForm: null, expectedResult: "" },
    { email: "a@b.com", submittingForm: false, expectedResult: "" },
    { email: "a.g@b.com", submittingForm: true, expectedResult: "" },
    { email: "a.R@b.com", submittingForm: null, expectedResult: "" },
    { email: "a@b.c", submittingForm: false, expectedResult: "entered email is too short" },
    { email: "a@b.c", submittingForm: true, expectedResult: "entered email is too short" },
    { email: "a@b.c", submittingForm: null, expectedResult: "entered email is too short" },
    { email: "!@b.com", submittingForm: false, expectedResult: "" },
    { email: "a@gmailcom", submittingForm: true, expectedResult: "wrong email format" },
    { email: "3@b.com", submittingForm: null, expectedResult: "" },
    { email: "a@#.com", submittingForm: false, expectedResult: "wrong email format" },
    { email: "a@b.$om", submittingForm: true, expectedResult: "wrong email format" },
    { email: "a@b.лom", submittingForm: null, expectedResult: "wrong email format" },
]

export const nameTestCases = [
    { name: "Qwert Rtytr", submittingForm: true, expectedResult: ""},
    { name: "Qwert Rtytr", submittingForm: false, expectedResult: "" },
    { name: "Qwert Rtytr", submittingForm: null, expectedResult: "" },
    { name: "", submittingForm: true, expectedResult: "please enter your credentials" },
    { name: "r", submittingForm: null, expectedResult: "entry is too short" },
    { name: "f!f3", submittingForm: null, expectedResult: "entry contains not allowed characters" },
    { name: "343", submittingForm: null, expectedResult: "entry contains not allowed characters" },
    { name: "#sf!", submittingForm: null, expectedResult: "entry contains not allowed characters" },
    { name: "Fdfe$1", submittingForm: null, expectedResult: "entry contains not allowed characters" },
]

export const passwordTestCases = [
    { password: "", submittingForm: true, expectedResult: "please enter your password"},
    { password: "", submittingForm: false, expectedResult: "" },
    { password: "", submittingForm: null, expectedResult: "" },
    { password: "fr4", submittingForm: null, expectedResult: "your password is too short" },
    { password: "3f3f334rfsdfrfsdsd", submittingForm: null, expectedResult: "your password is too long" },
    { password: "1qQwerty", submittingForm: null, expectedResult: "your password has wrong format" },
    { password: "1q!werty", submittingForm: null, expectedResult: "your password has wrong format" },
    { password: "Qq!werty", submittingForm: null, expectedResult: "your password has wrong format" },
    { password: "1!qQwerty", submittingForm: null, expectedResult: "" },
]

export const secondPasswordTestCases = [
    { password: "", secondPassword: "", expectedResult: ""},
    { password: "4fdg", secondPassword: "3sdc", expectedResult: "entered passwords do not match" },
    { password: "1!qQwerty", secondPassword: "1!qQwerty", expectedResult: "" }
]

describe("validation name, email, password unit test", () => {

    test('testing email validation function', () => {
        emailTestCases.forEach((it) => {
            let result = validateEmail(it.email, it.submittingForm)
            expect(result).toEqual(it.expectedResult)
        })

    })

    test('testing name validation function', () => {
        nameTestCases.forEach((it)=>{
            let result = validateName(it.name, it.submittingForm)
            expect(result).toEqual(it.expectedResult)
        })
    })

    test('testing password validation function', () => {
        passwordTestCases.forEach((it) => {
            let result = validatePassword(it.password, it.submittingForm)
            expect(result).toEqual(it.expectedResult)
        })
    })

    test('testing second password validation function', () => {
        secondPasswordTestCases.forEach((it) => {
            let result = validateSecondPassword(it.password, it.secondPassword)
            expect(result).toEqual(it.expectedResult)
        })
    })

})