// function checks email against regex const and generates notification text for the user
//Empty string means that everything is OK if the value is not submitted and is error when it is
export const validateEmail = (email, submittingForm) => {

    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    if (!email && submittingForm) {
        return "please enter your email"
    }

    if (!email) {
        return ""
    }

    if (email.length <= 6) {
        return "entered email is too short"
    }

    if (!regex.test(email)) {
        return "wrong email format"
    }

    return ""
}

// function checks name against regex const and generates notification text for the user
//Empty string means that everything is OK if the value is not submitted and is error when it is
export const validateName = (name, submittingForm) => {
    const regex = /^[a-zA-Z\s]*$/

    if (name.length === 0 && submittingForm) {
        return "please enter your credentials"
    }

    if (name.length < 2 && name.length !== 0) {
        return "entry is too short"
    }

    if (!regex.test(name)) {
        return "entry contains not allowed characters"
    }

    return ""
}

// function checks password against regex const and generates notification text for the user
//Empty string means that everything is OK if the value is not submitted and is error when it is
export const validatePassword = (password, submittingForm) => {

    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/

    if (!password && submittingForm) {
        return "please enter your password"
    }

    if (!password) {
        return ""
    }

    if (password.length < 6) {
        return "your password is too short"
    }

    if (password.length > 16) {
        return "your password is too long"
    }

    if (!regex.test(password)) {
        return "your password has wrong format"
    }

    return ""
}

// function checks that two entered passwords are matching and generates alert when they are not 
export const validateSecondPassword = (password, secondPassword) => {
    if (secondPassword.length > 0 &&
        password !== secondPassword) {
        return "entered passwords do not match"
    } else {
        return ""
    }
}