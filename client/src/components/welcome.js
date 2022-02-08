import React from 'react'
import { Box, Typography } from "@mui/material"
import CoPresentTwoToneIcon from '@mui/icons-material/CoPresentTwoTone'

import welcomeStyles from './styles/welcomeStyles.js'
import textLabelsEN from './resources/textLabelsEN.js'

const Welcome = () => {
    return (
        <>
            <Box sx={welcomeStyles.mainBox}>
                <Box sx={welcomeStyles.welcomeBox}>
                    <Box sx={welcomeStyles.logoBox}>
                        <CoPresentTwoToneIcon fontSize="large" />
                        <Typography variant='h5'>{textLabelsEN.appName}</Typography>
                    </Box>
                    <Typography align='left' color='primary' variant='subtitle1' sx={welcomeStyles.copyright}>Created by Txs</Typography>
                </Box>
            </Box>
        </>
    )
}

export default Welcome