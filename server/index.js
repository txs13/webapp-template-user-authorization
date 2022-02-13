import dotenv from "dotenv"
import app from './app.js'

dotenv.config()

app.listen(process.env.PORT || 5000,
    () => { console.log(`Server is listening on port ${process.env.PORT || 5000}`) })
