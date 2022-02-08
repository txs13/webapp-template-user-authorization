import React from 'react'

import { Box, Typography, Button } from "@mui/material"
import cookiesInfoStyles from './styles/cookiesInfoStyles.js'
import textLabelsEN from './resources/textLabelsEN.js'


const CookiesInfo = ({ confirmCookiesClick, cookiesConfirmed }) => {
    return (
        <>
            <Box id="cookies-box" sx={{ ...cookiesInfoStyles.cookiesBox,
                    display: cookiesConfirmed === "confirmed" ? "none" : "flex"}}>
                <Typography sx={cookiesInfoStyles.cookiesText}>{textLabelsEN.cookiesInfo}</Typography>
                <Button sx={cookiesInfoStyles.cookiesClose} onClick={confirmCookiesClick}
                    size="small" variant='outlined'>
                    {textLabelsEN.cookiesButton}
                </Button>
            </Box>
        </>
    )
}

export default CookiesInfo