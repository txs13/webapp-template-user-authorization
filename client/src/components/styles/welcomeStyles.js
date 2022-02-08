const welcomeStyles = {
    mainBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    },
    welcomeBox: {
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
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    logoBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "20%",
        gap: "10px"
    },
    copyright: {
        left: "10%",
        bottom: "5px",
        position: "absolute",
    }
}

export default welcomeStyles