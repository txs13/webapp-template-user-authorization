import React from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useCookies } from 'react-cookie'
import { Box, Typography, TextField, Checkbox, FormControlLabel, Button, ButtonGroup } from "@mui/material"
import CoPresentTwoToneIcon from '@mui/icons-material/CoPresentTwoTone'

import appMainStyles from './styles/appMainStyles.js'

const AppMain = () => {

    const dispatch = useDispatch()
    const appState = useSelector((state) => state.appState.value)
    const user = useSelector((state) => state.user.value)

    return (
        <>
            <h1>MAIN APP FRAME</h1>
        </>
    )
}

export default AppMain