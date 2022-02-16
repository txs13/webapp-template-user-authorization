import React from 'react'

import { Box, Typography, Button } from "@mui/material"
import cookiesInfoStyles from './styles/cookiesInfoStyles.js'
import textLabelsEN from './resources/textLabelsEN.js'


const CookiesInfo = ({ confirmCookiesClick, cookiesConfirmed }) => {
    return (
        <>
            <Box id="cookies-box" sx={{ ...cookiesInfoStyles.cookiesBox,
                    display: cookiesConfirmed === "confirmed" ? "none" : "flex"}}>
                <Typography id="cookies-text"
                    sx={cookiesInfoStyles.cookiesText}>{textLabelsEN.cookiesInfo}</Typography>
                <Button id="cookies-btn"
                    sx={cookiesInfoStyles.cookiesClose} onClick={confirmCookiesClick}
                    size="small" variant='outlined'>
                    {textLabelsEN.cookiesBtn}
                </Button>
            </Box>
        </>
    )
}

export default CookiesInfo