import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
//import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const _dirname = dirname(fileURLToPath(import.meta.url))
const pathToPrivKey = path.join(_dirname, '..', 'keys', 'id_rsa_pub.pem')
const PUB_KEY = fs.readFileSync(pathToPrivKey, 'utf8')

const Users = mongoose.model("Users")

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
}

const strategy = new Strategy(options, (payload, done) => {

    Users.findOne({_id: payload.sub})
        .then((user)=>{
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
        .catch((error)=>{
            done(error, false)
        })
})

export default (passport) => {
    passport.use(strategy)
}