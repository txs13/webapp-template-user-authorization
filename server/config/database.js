import mongoose from 'mongoose'
import dotenv from 'dotenv'

const dbConnect = async () => {

    dotenv.config()

    const PROD_DB_URL = process.env.PROD_DB_URL
    const DEV_DB_URL = process.env.DEV_DB_URL
    const DOCKER_DB_URL = process.env.DOCKER_DB_URL || "mongodb://mongo:27017"
    const DOCKER_MODE = process.env.DOCKER_MODE
    
    // if none of the mentioned production modes would be mentioned, dev mode will be taken
    let connectionString = DEV_DB_URL || "mongodb://localhost:27017"

    if (DOCKER_MODE === "true") {
        connectionString = DOCKER_DB_URL
        console.log("Docker mode")
    } 
    
    if (DOCKER_MODE === "false")
    {
        connectionString = PROD_DB_URL
        console.log("Standard mode")
    }
     
    const DB_NAME = process.env.DB_NAME || "webapp_template"

    mongoose.connection.on('connected', () => {
        console.log('DB is connected - OK')
    })

    mongoose.connection.on("error", (error) => {
        console.log(`DB has not connected with the error: ${error}`)
    })

    await mongoose.connect(connectionString,
        {
            dbName: DB_NAME
        })

}

export default dbConnect