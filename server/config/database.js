import mongoose from 'mongoose'
import dotenv from 'dotenv'

const dbConnect = () => {

    dotenv.config()

    const PROD_DB_URL = process.env.PROD_DB_URL
    const DEV_DB_URL = process.env.DEV_DB_URL
    const connectionString = PROD_DB_URL || DEV_DB_URL

    mongoose.connect(connectionString,
        {

        },
        (error) => {
            if (error) {
                console.log(`database connection failed with the error ${error}`)

            }
        })

    mongoose.connection.on('connected', () => {
        console.log('DB is connected - OK')
    })

}

export default dbConnect