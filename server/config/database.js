import mongoose from 'mongoose'
import dotenv from 'dotenv'

const dbConnect = async () => {

    dotenv.config()

    const PROD_DB_URL = process.env.PROD_DB_URL
    const DEV_DB_URL = process.env.DEV_DB_URL
    const DB_NAME = process.env.DB_NAME || "webapp_template"
    const connectionString = PROD_DB_URL || DEV_DB_URL

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