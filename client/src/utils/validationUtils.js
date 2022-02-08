import textLabelsEN from "../components/resources/textLabelsEN.js"

// function checks email against regex const and generates notification text for the user
//Empty string means that everything is OK if the value is not submitted and is error when it is
export const validateEmail = (email, submittingForm) => {

    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    if (!email && submittingForm) {
        return textLabelsEN.enterYourEmail
    }

    if (!email) {
        return ""
    }

    if (email.length <= 6) {
        return textLabelsEN.emailIsTooShort
    }

    if (!regex.test(email)) {
        return textLabelsEN.emailWrongFormat
    }

    return ""
}

// function checks name against regex const and generates notification text for the user
//Empty string means that everything is OK if the value is not submitted and is error when it is
export const validateName = (name, submittingForm) => {
    const regex = /^[a-zA-Z\s]*$/

    if (name.length === 0 && submittingForm) {
        return textLabelsEN.enterYourName
    }

    if (name.length < 2 && name.length !== 0) {
        return textLabelsEN.nameIsShort
    }

    if (!regex.test(name)) {
        return textLabelsEN.nameWrongFormat
    }

    return ""
}

// function checks password against regex const and generates notification text for the user
//Empty string means that everything is OK if the value is not submitted and is error when it is
export const validatePassword = (password, submittingForm) => {

    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/

    if (!password && submittingForm) {
        return textLabelsEN.enterYourPassword
    }

    if (!password) {
        return ""
    }

    if (password.length < 6) {
        return textLabelsEN.passwordIsShort
    }

    if (password.length > 16) {
        return textLabelsEN.passwordIsLong
    }

    if (!regex.test(password)) {
        return textLabelsEN.passwordWrongFormat
    }

    return ""
}

// function checks that two entered passwords are matching and generates alert when they are not 
export const validateSecondPassword = (password, secondPassword) => {
    if (secondPassword.length > 0 &&
        password !== secondPassword) {
        return textLabelsEN.secondPasswordNotMatch
    } else {
        return ""
    }
}