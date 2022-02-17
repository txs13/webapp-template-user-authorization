import React, { useState, useEffect } from 'react'
import { useDispatch } from "react-redux"
import { Box, Typography, TextField, Button, ButtonGroup, MenuItem, Alert } from "@mui/material"
import CoPresentTwoToneIcon from '@mui/icons-material/CoPresentTwoTone'

import registerStyles from './styles/registerStyles.js'
import { appStates, changeState } from "../store/features/appState.js"
import { USERS_API, OPTIONS } from '../settings/network.js'
import { validatePassword, validateEmail, validateName, validateSecondPassword } from '../utils/validationUtils.js'
import textLabelsEN from "./resources/textLabelsEN.js"

const Register = ({ roles, client }) => {
    const dispatch = useDispatch()

    const [formState, setFormState] = useState({
        email: "",
        emailError: "",
        password: "",
        passwordError: "",
        secondPassword: "",
        secondPasswordError: "",
        familyname: "",
        familynameError: "",
        role: "",
        roleError: "",
        alertMessage: "",
        infoMessage: textLabelsEN.passwordRequirementsAlert,
        submitNewUser: false
    })

    const onChangeUser = (e) => {
        const fieldName = e.target.name
        const value = e.target.value
        if (fieldName === "role" && roles.find(role => role._id === value)) {
            setFormState({ ...formState, [fieldName]: value, roleError: "" })
        } else {
            setFormState({ ...formState, [fieldName]: value })
        }
    }

    const generateErrorAlert = (message) => {
        setFormState({ ...formState, alertMessage: message, submitNewUser: false })
        setTimeout(() => {
            setFormState({ ...formState, alertMessage: "", submitNewUser: false })
        }, 3000)
    }

    const backToLogInClick = () => {
        dispatch(changeState({ state: appStates.LOGIN }))
    }

    // begining of API block
    // the idea is to generate errors for the empty strings only if user is trying to register with
    // these empty strings, therefore first step is to check emails with additional conditions
    // and only after to send request to the server
    const registerClick = () => {
        setFormState({
            ...formState,
            emailError: validateEmail(formState.email, true),
            passwordError: validatePassword(formState.password, true),
            secondPasswordError: validateSecondPassword(formState.password, formState.secondPassword),
            familynameError: validateName(formState.familyname, true),
            roleError: formState.role === "" ? textLabelsEN.chooseRoleMsg : "",
            submitNewUser: true
        })
    }

    // pure request to the server function
    const postNewUser = () => {
        if (formState.emailError === "" &&
            formState.passwordError === "" &&
            formState.secondPasswordError === "" &&
            formState.familynameError === "" &&
            formState.roleError === "") {
            client.post(`${USERS_API}/register`, formState, OPTIONS)
                .then((res) => {
                    dispatch(changeState({ state: appStates.LOGIN }))
                })
                .catch((error) => {
                    if (error.response) {
                        generateErrorAlert(error.response.data.msg === "User with this email is already registered!" ?
                            textLabelsEN.userExistsAlert : textLabelsEN.otherErrorAlert)
                    } else if (error.request) {
                        console.log(error.request)
                    } else {
                        console.log('Error', error.message)
                    }
                })

        }
    }

    // to ensure that email and password are checked and updated
    useEffect(() => {
        if (formState.submitNewUser) {
            setFormState({ ...formState, submitNewUser: false })
            postNewUser()
        }
    }, [formState.submitNewUser]) // eslint-disable-line react-hooks/exhaustive-deps

    // end of login API block

    const checkEmailEntry = () => {
        if (validateEmail(formState.email) !== "") {
            setFormState({ ...formState, emailError: validateEmail(formState.email) })
        } else if (formState.email !== "" && validateEmail(formState.email) === "") {
            client.post(`${USERS_API}/checkemail`,
                { email: formState.email },
                OPTIONS)
                .then((res) => {
                    if (res.data.status === "success") {
                        if (res.data.isAvailable === "true") {
                            // this means that this email is available for registration
                            setFormState({ ...formState, emailError: "" })
                        } else {
                            // this means that this email is already used
                            setFormState({ ...formState, emailError: textLabelsEN.emailIsUsedMsg })
                        }
                    }

                    if (res.data.status === "failure") {
                        setFormState({
                            ...formState,
                            emailError: "",
                            alertMessage: `${res.msg}`
                        })
                    }
                    if (res.data.status !== "success" && res.data.status !== "failure") {
                        setFormState({
                            ...formState,
                            emailError: "",
                            alertMessage: textLabelsEN.otherErrorAlert
                        })
                    }

                })
        } else {
            setFormState({ ...formState, emailError: "" })
        }
    }

    const checkPasswordEntry = () => {
        setFormState({ ...formState, passwordError: validatePassword(formState.password) })
    }

    const checkSecondPasswordEntry = () => {
        setFormState({
            ...formState,
            secondPasswordError: validateSecondPassword(formState.password, formState.secondPassword)
        })
    }

    const checkFamilynameEntry = () => {
        const familyname = formState.familyname.trim()
        const familynameError = validateName(familyname)
        setFormState({
            ...formState,
            familyname: familyname,
            familynameError: familynameError
        })
    }

    return (
        <>
            <Box sx={registerStyles.mainBox}>
                <Box sx={registerStyles.registerBox}>
                    <Box sx={registerStyles.logoBox}>
                        <CoPresentTwoToneIcon fontSize="large" />
                        <Typography variant='h5'>{textLabelsEN.appName}</Typography>
                    </Box>

                    <Alert data-testid="loginAlertId" id="register-form-alert"
                        sx={{
                            ...registerStyles.alert,
                            display: formState.alertMessage !== "" ? "" : "none"
                        }}
                        severity="error">
                        {formState.alertMessage}
                    </Alert>

                    <Alert data-testid="infoAlertId" id="register-form-info"
                        sx={{
                            ...registerStyles.alert,
                            display: formState.alertMessage === "" &&
                                formState.emailError === "" &&
                                formState.passwordError === "" &&
                                formState.secondPasswordError === "" &&
                                formState.familynameError === "" &&
                                formState.roleError === "" ? "" : "none"
                        }}
                        severity="info">
                        {formState.infoMessage}
                    </Alert>

                    <TextField
                        id="register-form-email-entry"
                        label={textLabelsEN.emailEntry} name="email" margin='none'
                        sx={registerStyles.inputLogin}
                        error={formState.emailError === "" ? false : true}
                        helperText={formState.emailError === "" ? "" : formState.emailError}
                        FormHelperTextProps={{ error: true }}
                        type="email"
                        onBlur={checkEmailEntry}
                        inputProps={{ inputMode: "email" }}
                        onChange={onChangeUser}
                        variant="outlined"
                        value={formState.email} />

                    <TextField
                        id="register-form-password-entry" label={textLabelsEN.passwordEntry}
                        name="password" margin='none' type='password'
                        sx={registerStyles.inputPass} onChange={onChangeUser}
                        error={formState.passwordError === "" ? false : true}
                        helperText={formState.passwordError === "" ? "" : formState.passwordError}
                        FormHelperTextProps={{ error: true }}
                        inputProps={{ inputMode: "password" }}
                        onBlur={checkPasswordEntry}
                        variant="outlined"
                        value={formState.password} />

                    <TextField
                        id="register-form-second-password-entry" label={textLabelsEN.repeatPasswordEntry}
                        name="secondPassword" margin='none' type='password'
                        sx={registerStyles.inputPass} onChange={onChangeUser}
                        error={formState.secondPasswordError === "" ? false : true}
                        helperText={formState.secondPasswordError === "" ? "" : formState.secondPasswordError}
                        FormHelperTextProps={{ error: true }}
                        inputProps={{ inputMode: "password" }}
                        onBlur={checkSecondPasswordEntry}
                        variant="outlined"
                        value={formState.secondPassword} />

                    <TextField
                        id="register-form-familyname-entry" label={textLabelsEN.familynameEntry}
                        name="familyname" margin='none'
                        sx={registerStyles.inputFamilyName} onChange={onChangeUser}
                        error={formState.familynameError === "" ? false : true}
                        helperText={formState.familynameError === "" ? "" : formState.familynameError}
                        FormHelperTextProps={{ error: true }}
                        onBlur={checkFamilynameEntry}
                        variant="outlined"
                        value={formState.familyname} />

                    <TextField
                        id="register-form-role-entry" select label={textLabelsEN.roleEntry}
                        name="role" margin='none'
                        sx={registerStyles.inputRole} onChange={onChangeUser}
                        error={formState.roleError === "" ? false : true}
                        helperText={formState.roleError === "" ? "" : formState.roleError}
                        FormHelperTextProps={{ error: true }}
                        value={formState.role}>
                        {roles.map((role) => (
                            <MenuItem key={role._id} value={role._id} id={`register-form-role-${role.userRole.toLowerCase()}`}>
                                {role.userRole}
                            </MenuItem>
                        ))}
                    </TextField>


                    <ButtonGroup variant="text" sx={registerStyles.buttonGroup}>
                        <Button fullWidth onClick={backToLogInClick} id="register-form-back-btn">
                            {textLabelsEN.backToLoginBtn}
                        </Button>
                        <Button fullWidth onClick={registerClick} id="register-form-register-btn">
                            {textLabelsEN.createUserBtn}
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </>
    )
}

export default Register