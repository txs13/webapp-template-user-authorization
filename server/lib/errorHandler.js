const errorHandler = (err, req, res, next) => {
    if (err) {
        res.status(500).json({
            status: "failure",
            msg: `Something went wrong. Pleae contact system administrator. Error code:${err}`
        })
    }
}

export default errorHandler