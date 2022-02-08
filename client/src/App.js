import React, { useEffect, useState } from "react"
import { Box } from "@mui/material"

import { useSelector, useDispatch } from "react-redux"
import axios from 'axios'
import { useCookies } from 'react-cookie'

import Welcome from "./components/welcome.js"
import AppMain from "./components/appMain.js"
import Login from "./components/login.js"
import Register from './components/register.js'
import AboutApp from "./components/aboutApp.js"
import Profile from "./components/profile.js"
import Settings from "./components/settings.js"
import { appStates, changeState } from "./store/features/appState.js"
import { login } from './store/features/user.js'
import { SERVER_URL, SERVER_PORT, ROLES_API, USERS_API, OPTIONS, getOptionsWithToken } from './settings/network.js'
import AppNavbar from "./components/appNavbar.js"
import CookiesInfo from "./components/cookiesInfo.js"


const client = axios.create({
    baseURL: `${SERVER_URL}:${SERVER_PORT}`,
    timeout: 1000
})

const App = () => {

    const [cookies, setCookie] = useCookies(['recruitment-portal'])
    const [cookiesConfirmed, setCookiesConfirmed] = useState(cookies.cookiesConfirmed)

    const appState = useSelector((state) => state.appState.value)
    const dispatch = useDispatch()

    const [roles, setRoles] = useState([])

    const confirmCookiesClick = () => {
        setCookiesConfirmed("confirmed")
        setCookie("cookiesConfirmed", "confirmed", { path: "/" })
    }

    useEffect(() => {
        // get roles
        client.get(`${ROLES_API}`, OPTIONS)
            .then((res) => {
                setRoles(res.data)
            })
        // to check cookies
        if (cookies.token) {
            client.get(`${USERS_API}/refresh`, {...getOptionsWithToken(cookies.token)})
                .then((res) => {
                    // if token is correct and still valid, we get fresh new token and store it
                    const {token, user, expiresIn} = res.data
                    setCookie("token", token, { path: "/", maxAge: expiresIn })
                    dispatch(login({user: user}))
                    setTimeout(
                        () => {
                            dispatch(changeState({ state: appStates.APPMAIN }))
                        },
                        1500)                })
                .catch((error) => {
                    setTimeout(
                        () => {
                            console.log(error)
                            dispatch(changeState({ state: appStates.LOGIN }))
                        },
                        1500)

                })
        } else {
            setTimeout(
                () => {
                    dispatch(changeState({ state: appStates.LOGIN }))
                },
                1500)
        }

    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <>
            <CookiesInfo cookiesConfirmed={cookiesConfirmed} confirmCookiesClick={confirmCookiesClick}/>
            <AppNavbar />
            <Box sx={{ width: "100vw", height: "calc( 100vh - 60px )", backgroundColor: "primary.light" }}>
                {appState.state === appStates.WELCOMESCREEN ? <Welcome /> : null}
                {appState.state === appStates.LOGIN ? <Login client={client} /> : null}
                {appState.state === appStates.REGISTER ? <Register roles={roles} client={client} /> : null}
                {appState.state === appStates.APPMAIN ? <AppMain /> : null}
                {appState.state === appStates.ABOUTAPP ? <AboutApp /> : null}
                {appState.state === appStates.SETTINGS ? <Settings /> : null}
                {appState.state === appStates.PROFILE ? <Profile /> : null}
            </Box>
        </>
    );
};

export default App;
