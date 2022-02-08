import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from "react-redux"
import { useCookies } from 'react-cookie'
import { Alert, Box, Typography, TextField, Checkbox, FormControlLabel, Button, ButtonGroup } from "@mui/material"
import CoPresentTwoToneIcon from '@mui/icons-material/CoPresentTwoTone'

import loginStyles from './styles/loginStyles.js'
import { appStates, changeState } from "../store/features/appState.js"
import { login } from '../store/features/user.js'
import { USERS_API, OPTIONS } from '../settings/network.js'
import { validatePassword, validateEmail } from '../utils/validationUtils.js'
import textLabelsEN from "./resources/textLabelsEN.js"
import { appName } from '../settings/appSettings.js'

const Login = ({ client }) => {

    const dispatch = useDispatch()
    const [cookies, setCookie, removeCookie] = useCookies(['recruitment-portal'])

    const [formState, setFormState] = useState({
        email: "",
        password: "",
        emailError: "",
        passwordError: "",
        rememberMe: true,
        loginInCookies: false,
        alertMessage: "",
        submitEmailPassword: false
    })

    const generateErrorAlert = (message) => {
        setFormState({ ...formState, alertMessage: message, submitEmailPassword: false })
        setTimeout(() => {
            setFormState({ ...formState, alertMessage: "", submitEmailPassword: false })
        }, 3000)
    }

    // cheking whether user email is stored in cookies - if yes, we use it further 
    useEffect(() => {
        if (cookies.email) {
            setFormState({
                ...formState,
                email: cookies.email,
                loginInCookies: true
            })
        }

    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // to set input focus either to the email in case it is to b eentered or to password
    // in case email is already stored in cookies
    const callBackRef = useCallback((inputElement) => {
        if (inputElement) {
            inputElement.focus()
        }
    },
        [],
    )

    const registerClick = () => {
        dispatch(changeState({ state: appStates.REGISTER }))
    }

    // begining of API block
    // the idea is to generate errors for the empty strings only if user is trying to log in
    // these empty strings, therefore first step is to check emails with additional conditions
    // and only after to send request to the server
    const loginClick = () => {
        setFormState({
            ...formState,
            emailError: validateEmail(formState.email, true),
            passwordError: validatePassword(formState.password, true),
            submitEmailPassword: true
        })

    }
    // to ensure that email and password are checked and updated
    useEffect(() => {
        if (formState.submitEmailPassword) {
            submitEmailPassword()
            setFormState({ ...formState, submitEmailPassword: false })
        }
    }, [formState.submitEmailPassword]) // eslint-disable-line react-hooks/exhaustive-deps

    // pure request to the server function
    const submitEmailPassword = () => {
        if (formState.emailError === ""
            && formState.passwordError === ""
        ) {
            client.post(`${USERS_API}/login`,
                { email: formState.email, password: formState.password }, OPTIONS)
                .then((res) => {
                    const { token, expiresIn, user } = res.data
                    setCookie("token", token, { path: "/", maxAge: expiresIn })
                    if (formState.rememberMe) {
                        setCookie("email", user.email, { path: "/" })
                    } else {
                        removeCookie("email", { path: "/" })
                    }
                    dispatch(login({ user: user }))
                    dispatch(changeState({ state: appStates.APPMAIN }))
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

    const onPressEnter = (e) => {
        if (e.key === "Enter") {
            loginClick()
        }
    }

    const onUserEntryChange = (e) => {
        const fieldName = e.target.name
        const value = e.target.value
        setFormState({ ...formState, [fieldName]: value })
    }

    const checkEmailEntry = () => {
        setFormState({ ...formState, emailError: validateEmail(formState.email) })
    }

    const checkPasswordEntry = () => {
        //so far I decided not to check whether password matches password requirements during logging in
        //setFormState({ ...formState, passwordError: validatePassword(formState.password) })
    }

    const rememberMeClick = () => {
        if (formState.rememberMe) {
            setFormState({ ...formState, rememberMe: false })
        } else {
            setFormState({ ...formState, rememberMe: true })
        }
    }

    return (
        <>
            <Box sx={loginStyles.mainBox}>
                <Box sx={loginStyles.loginBox}>
                    <Box sx={loginStyles.logoBox}>
                        <CoPresentTwoToneIcon fontSize="large" />
                        <Typography variant='h5'>{textLabelsEN.appName}</Typography>
                    </Box>

                    <Alert aria-label="loginAlert" sx={{
                        ...loginStyles.alert,
                        display: formState.alertMessage !== "" ? "" : "none"
                    }}
                        severity="error">
                        {formState.alertMessage}
                    </Alert>

                    <Box sx={loginStyles.inputBox}>
                        <TextField
                            id="email-entry"
                            inputRef={!formState.loginInCookies ? callBackRef : {}}
                            label={textLabelsEN.emailEntry} name="email" margin='dense'
                            sx={loginStyles.inputLogin}
                            error={formState.emailError === "" ? false : true}
                            helperText={formState.emailError === "" ? "" : formState.emailError}
                            FormHelperTextProps={{ error: true }}
                            type="email"
                            onBlur={checkEmailEntry}
                            inputProps={{ inputMode: "email" }}
                            onChange={onUserEntryChange}
                            variant="outlined"
                            value={formState.email} />

                        <TextField
                            id="password-entry"
                            inputRef={formState.loginInCookies ? callBackRef : {}}
                            label={textLabelsEN.passwordEntry} name="password"
                            margin='dense' type='password'
                            sx={loginStyles.inputPass} onChange={onUserEntryChange}
                            error={formState.passwordError === "" ? false : true}
                            helperText={formState.passwordError === "" ? "" : formState.passwordError}
                            FormHelperTextProps={{ error: true }}
                            inputProps={{ inputMode: "password" }}
                            onBlur={checkPasswordEntry}
                            onKeyPress={onPressEnter}
                            variant="outlined"
                            value={formState.password} />

                        <FormControlLabel
                            control={<Checkbox
                                defaultChecked
                                value={formState.rememberMe}
                                onChange={rememberMeClick} />}
                            label={textLabelsEN.rememberMeCheckBox} sx={loginStyles.remember} />
                    </Box>
                    <ButtonGroup variant="text" sx={loginStyles.buttonGroup}>
                        <Button fullWidth onClick={loginClick}>{textLabelsEN.loginButton}</Button>
                        <Button fullWidth onClick={registerClick}>{textLabelsEN.registerButton}</Button>
                    </ButtonGroup>

                    <Typography color='primary' variant='subtitle1' sx={loginStyles.copyright}>Created by Txs</Typography>
                </Box>
            </Box>
        </>
    )
}

export default Login