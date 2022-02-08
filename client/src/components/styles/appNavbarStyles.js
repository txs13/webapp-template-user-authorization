const appNavBarStyles = {
    navbar: {
        height: "60px"
    },
    toolbox: {
        display: "flex",
        position: "relative",
        alignContent: "center",
        margin: "0",
        padding: "0",
        height: "100%"
    },
    logoBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "40px",
        width: "40px",
        background: "Window",
        borderRadius: 1,
        opacity: "80%",
        left: "10px",
        position: "absolute",
        '&:hover': {
            cursor: "pointer"
        },
    },
    userBox: {
        flexGrow: "0",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "40px",
        width: "40px",
        borderRadius: 1,
        right: "15px",
        position: "absolute",
    },
    logo: {
        height: "70%",
        width: "70%",
        margin: "auto",
        opacity: "100%",
        fill: "black"
    },
    userIcon: {
        fill: "Window"
    },
    headerName: {
        margin: "0",
        padding: "0",
        position: "absolute",
        left: "60px",
        display: {
            xs: "none",
            sm: ""
        }
    },
    aboutApp: {
        margin: "0",
        padding: "0",
        position: "absolute",
        right: "65px",
        '&:hover': {
            cursor: "pointer"
        },
        '&:active': {
            color: "lightgrey"
        },
        userSelect: "none"
    },

}

export default appNavBarStyles