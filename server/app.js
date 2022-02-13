import express from "express"
import dotenv from "dotenv"
import passport from "passport"
import cors from 'cors'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

dotenv.config()
const app = express()

// database connection & models initaliation
import dbConnect from './config/database.js'
dbConnect()
import './models/User.js'
import './models/UserRoles.js'
import './config/initializeDB.js'

// passport configuration and initialization
import passportConfig from './config/passport.js'
passportConfig(passport)
app.use(passport.initialize())

// auxiliary middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// react frontend routing
const _dir = dirname(fileURLToPath(import.meta.url))
const pathToFrontendBuild = path.join(_dir, '..', 'client', 'build')
app.use(express.static('frontend-build' || pathToFrontendBuild))

// api
import router from './routes/routes.js'
app.use('/api/v1', router)

// error handling
import errorHandler from './lib/errorHandler.js'
app.use(errorHandler)

export default app