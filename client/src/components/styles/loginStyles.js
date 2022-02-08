const loginStyles = {
    mainBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        flexDirection: "column",
        position: "relative"
    },
    loginBox: {
        width: {
            xs: '350px',
            sm: '400px',
            md: '400px',
            lg: '400px',
            xl: '400px',
        },
        height: {
            xs: '470px',
            sm: '500px',
            md: '500px',
            lg: '500px',
            xl: '500px',
        },
        backgroundColor: 'Window',
        borderRadius: 5,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        gap: "0",
        position: "relative",
    },
    logoBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "25%",
        gap: "10px",
        userSelect: "none"
    },
    inputBox: {
        position: "absolute",
        top: "165px"

    },
    inputLogin: {
        width: "80%",
        marginLeft: "10%",
        marginRight: "10%x"
    },
    inputPass: {
        width: "80%",
        marginLeft: "10%",
        marginRight: "10%x"
    },
    remember: {
        marginLeft: "8%",
        userSelect: "none"
    },
    buttonGroup: {
        width: "80%",
        marginLeft: "10%",
        marginRight: "10%",
        marginTop: "5%",
        position: "absolute",
        bottom: "50px"
    },
    copyright: {
        marginLeft: "10%",
        bottom: "5px",
        position: "absolute"
    },
    alert: {
        width: '80%',
        marginLeft: '10%',
        marginRight: '10%',
        marginTop: '0',
        marginBottom: '0'
    }
}


export default loginStyles