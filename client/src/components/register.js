import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import { Box, Typography, TextField, Button, ButtonGroup, MenuItem, Alert } from "@mui/material"
import CoPresentTwoToneIcon from '@mui/icons-material/CoPresentTwoTone'

import registerStyles from './styles/registerStyles.js'
import { appStates, changeState } from "../store/features/appState.js"
import { USERS_API, OPTIONS } from '../settings/network.js'
import { validatePassword, validateEmail, validateName, validateSecondPassword } from '../utils/validationUtils.js'
import { appName } from '../settings/appSettings.js'

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
        infoMessage: "password: 8-16 characters, minimum one digit, one special, one lower and upper case letter",
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
            roleError: formState.role === "" ? "please choose your role" : "",
            submitNewUser: true
        })
    }

    // to ensure that email and password are checked and updated
    useEffect(() => {
        if (formState.submitNewUser) {
            console.log('this happens')
            postNewUser()
            setFormState({ ...formState, submitNewUser: false })
        }
    }, [formState.submitNewUser]) // eslint-disable-line react-hooks/exhaustive-deps

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
                        generateErrorAlert(error.response.data.msg)
                    } else if (error.request) {
                        console.log(error.request)
                    } else {
                        console.log('Error', error.message)
                    }
                })

        }
    }
    // end of login API block

    const checkEmailEntry = () => {
        if (validateEmail(formState.email) !== "") {
            setFormState({ ...formState, emailError: validateEmail(formState.email) })
        } else if (formState.email !== "") {
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
                            setFormState({ ...formState, emailError: "This email is already used" })
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
                            alertMessage: "Unknown internal error has happened. Please contact system administrator"
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
                        <Typography variant='h5'>{appName}</Typography>
                    </Box>

                    <Alert sx={{
                        ...registerStyles.alert,
                        display: formState.alertMessage !== "" ? "" : "none"
                    }}
                        severity="error">
                        {formState.alertMessage}
                    </Alert>

                    <Alert sx={{
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
                        id="email-entry"
                        label='email' name="email" margin='none' sx={registerStyles.inputLogin}
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
                        id="password-entry"
                        label='password' name="password" margin='none' type='password'
                        sx={registerStyles.inputPass} onChange={onChangeUser}
                        error={formState.passwordError === "" ? false : true}
                        helperText={formState.passwordError === "" ? "" : formState.passwordError}
                        FormHelperTextProps={{ error: true }}
                        inputProps={{ inputMode: "password" }}
                        onBlur={checkPasswordEntry}
                        variant="outlined"
                        value={formState.password} />

                    <TextField
                        id="second-password-entry"
                        label='repeat password' name="secondPassword" margin='none' type='password'
                        sx={registerStyles.inputPass} onChange={onChangeUser}
                        error={formState.secondPasswordError === "" ? false : true}
                        helperText={formState.secondPasswordError === "" ? "" : formState.secondPasswordError}
                        FormHelperTextProps={{ error: true }}
                        inputProps={{ inputMode: "password" }}
                        onBlur={checkSecondPasswordEntry}
                        variant="outlined"
                        value={formState.secondPassword} />

                    <TextField
                        id="familyname"
                        label='family name' name="familyname" margin='none'
                        sx={registerStyles.inputFamilyName} onChange={onChangeUser}
                        error={formState.familynameError === "" ? false : true}
                        helperText={formState.familynameError === "" ? "" : formState.familynameError}
                        FormHelperTextProps={{ error: true }}
                        onBlur={checkFamilynameEntry}
                        variant="outlined"
                        value={formState.familyname} />

                    <TextField
                        id="role" select
                        label='role' name="role" margin='none'
                        sx={registerStyles.inputRole} onChange={onChangeUser}
                        error={formState.roleError === "" ? false : true}
                        helperText={formState.roleError === "" ? "" : formState.roleError}
                        FormHelperTextProps={{error: true}}
                        value={formState.role}>
                        {roles.map((role) => (
                            <MenuItem key={role._id} value={role._id}>
                                {role.userRole}
                            </MenuItem>
                        ))}
                    </TextField>


                    <ButtonGroup variant="text" sx={registerStyles.buttonGroup}>
                        <Button fullWidth onClick={backToLogInClick}>back to log in</Button>
                        <Button fullWidth onClick={registerClick}>create user</Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </>
    )
}

export default Register