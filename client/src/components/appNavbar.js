import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppBar, Toolbar, Box, Typography, Menu, IconButton, MenuItem } from "@mui/material"
import CoPresentTwoToneIcon from '@mui/icons-material/CoPresentTwoTone'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useTheme } from "@mui/material"
import { useCookies } from 'react-cookie'

import { appStates, changeState } from "../store/features/appState.js"
import { logout } from '../store/features/user.js'
import appNavBarStyles from './styles/appNavbarStyles.js'
import textLabelsEN from "./resources/textLabelsEN.js"

const menuStates = {
    toTheApp: textLabelsEN.menuToTheApp,
    settings: textLabelsEN.menuSettings,
    profile: textLabelsEN.menuProfile,
    logOut: textLabelsEN.menuLogOut,
    logIn: textLabelsEN.menuLogIn,
    register: textLabelsEN.menuRegister
}

const authorizedMenuSettings = [menuStates.toTheApp, menuStates.settings, menuStates.profile, menuStates.logOut]
const notAuthorizedMenuSettins = [menuStates.logIn, menuStates.register]

const AppNavbar = () => {

    const [anchorElUser, setAnchorElUser] = useState(null)

    const [cookies, setCookie, removeCookie] = useCookies(['recruitment-portal'])

    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()
    const theme = useTheme()

    const aboutAppClick = () => {
        dispatch(changeState({ state: appStates.ABOUTAPP }))
    }

    const logoClick = () => {
        if (user._id) {
            dispatch(changeState({ state: appStates.APPMAIN }))
        } else {
            dispatch(changeState({ state: appStates.LOGIN }))
        }
    }

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = (event) => {
        setAnchorElUser(null)
        const value = event.target.getAttribute('value')

        switch (value) {
            case menuStates.logIn:
                dispatch(changeState({ state: appStates.LOGIN }))
                break
            case menuStates.logOut:
                dispatch(logout())
                removeCookie("token", { path: "/" })
                dispatch(changeState({ state: appStates.LOGIN }))
                break
            case menuStates.profile:
                dispatch(changeState({ state: appStates.PROFILE }))
                break
            case menuStates.settings:
                dispatch(changeState({ state: appStates.SETTINGS }))
                break
            case menuStates.toTheApp:
                dispatch(changeState({ state: appStates.APPMAIN }))
                break
            case menuStates.register:
                dispatch(changeState({ state: appStates.REGISTER }))
                break
            default:
                console.log('wrong menu value')
        }
    }

    return (
        <>
            <AppBar position="static" sx={appNavBarStyles.navbar}>
                <Toolbar disableGutters variant="string" sx={appNavBarStyles.toolbox}>
                    <Box sx={appNavBarStyles.logoBox} onClick={logoClick}>
                        <CoPresentTwoToneIcon sx={appNavBarStyles.logo} fontSize="large" />
                    </Box>
                    <Typography sx={appNavBarStyles.headerName}
                        variant='h6'>
                        {textLabelsEN.appName}
                    </Typography>
                    <Typography onClick={aboutAppClick}
                        sx={{
                            ...appNavBarStyles.aboutApp,
                            display: user._id ? "none" : "",
                        }}
                        variant='h6'>
                        {textLabelsEN.aboutWebsiteLink}
                    </Typography>
                    <Box sx={appNavBarStyles.userBox}>
                        <IconButton id="navbar-menu-icon"
                            sx={{ p: 0 }} aria-label="menuButton" onClick={handleOpenUserMenu}>
                            <AccountCircle sx={appNavBarStyles.userIcon} fontSize="large" />
                        </IconButton>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {user._id
                                ? authorizedMenuSettings.map((menuItem) => (
                                    <MenuItem key={menuItem} onClick={handleCloseUserMenu}
                                        value={menuItem}
                                        id={`navbar-menu-item-${menuItem.toLowerCase().replace(" ", "")}`}>
                                        {menuItem}
                                    </MenuItem>
                                ))
                                : notAuthorizedMenuSettins.map((menuItem) => (
                                    <MenuItem key={menuItem} onClick={handleCloseUserMenu}
                                        value={menuItem}
                                        id={`navbar-menu-item-${menuItem.toLowerCase().replace(" ", "")}`}>
                                        {menuItem}
                                    </MenuItem>
                                ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default AppNavbar