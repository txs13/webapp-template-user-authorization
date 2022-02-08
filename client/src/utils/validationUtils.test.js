import { validateName, validatePassword, validateSecondPassword, validateEmail } from './validationUtils.js'
import textLabelsEN from '../components/resources/textLabelsEN.js'

export const emailTestCases = [
    { email: "", submittingForm: true, expectedResult: textLabelsEN.enterYourEmail },
    { email: "", submittingForm: null, expectedResult: "" },
    { email: "a@b.com", submittingForm: false, expectedResult: "" },
    { email: "a.g@b.com", submittingForm: true, expectedResult: "" },
    { email: "a.R@b.com", submittingForm: null, expectedResult: "" },
    { email: "a@b.c", submittingForm: false, expectedResult: textLabelsEN.emailIsTooShort },
    { email: "a@b.c", submittingForm: true, expectedResult: textLabelsEN.emailIsTooShort },
    { email: "a@b.c", submittingForm: null, expectedResult: textLabelsEN.emailIsTooShort },
    { email: "!@b.com", submittingForm: false, expectedResult: "" },
    { email: "a@gmailcom", submittingForm: true, expectedResult: textLabelsEN.emailWrongFormat },
    { email: "3@b.com", submittingForm: null, expectedResult: "" },
    { email: "a@#.com", submittingForm: false, expectedResult: textLabelsEN.emailWrongFormat },
    { email: "a@b.$om", submittingForm: true, expectedResult: textLabelsEN.emailWrongFormat },
    { email: "a@b.лom", submittingForm: null, expectedResult: textLabelsEN.emailWrongFormat },
]

export const nameTestCases = [
    { name: "Qwert Rtytr", submittingForm: true, expectedResult: ""},
    { name: "Qwert Rtytr", submittingForm: false, expectedResult: "" },
    { name: "Qwert Rtytr", submittingForm: null, expectedResult: "" },
    { name: "", submittingForm: true, expectedResult: textLabelsEN.enterYourName },
    { name: "r", submittingForm: null, expectedResult: textLabelsEN.nameIsShort },
    { name: "f!f3", submittingForm: null, expectedResult: textLabelsEN.nameWrongFormat },
    { name: "343", submittingForm: null, expectedResult: textLabelsEN.nameWrongFormat },
    { name: "#sf!", submittingForm: null, expectedResult: textLabelsEN.nameWrongFormat },
    { name: "Fdfe$1", submittingForm: null, expectedResult: textLabelsEN.nameWrongFormat },
]

export const passwordTestCases = [
    { password: "", submittingForm: true, expectedResult: textLabelsEN.enterYourPassword},
    { password: "", submittingForm: false, expectedResult: "" },
    { password: "", submittingForm: null, expectedResult: "" },
    { password: "fr4", submittingForm: null, expectedResult: textLabelsEN.passwordIsShort },
    { password: "3f3f334rfsdfrfsdsd", submittingForm: null, expectedResult: textLabelsEN.passwordIsLong },
    { password: "1qQwerty", submittingForm: null, expectedResult: textLabelsEN.passwordWrongFormat },
    { password: "1q!werty", submittingForm: null, expectedResult: textLabelsEN.passwordWrongFormat },
    { password: "Qq!werty", submittingForm: null, expectedResult: textLabelsEN.passwordWrongFormat },
    { password: "1!qQwerty", submittingForm: null, expectedResult: "" },
]

export const secondPasswordTestCases = [
    { password: "", secondPassword: "", expectedResult: ""},
    { password: "4fdg", secondPassword: "3sdc", expectedResult: textLabelsEN.secondPasswordNotMatch },
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