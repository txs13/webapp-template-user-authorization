import crypto from 'crypto'
import jsonwebtoken from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const _dirname = dirname(fileURLToPath(import.meta.url))
const pathToPrivKey = path.join(_dirname, '..', 'keys', 'id_rsa_priv.pem')
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8')
//const pathToPubKey = path.join(_dirname, '..', 'keys', 'id_rsa_priv.pem')
//const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8')

export const genPassword = (password) => {
    let salt = crypto.randomBytes(32).toString('hex')
    let genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return {
        salt: salt,
        hash: genHash
    }
}

export const validatePassword = (password, hash, salt) => {
    let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return hashVerify === hash
}

export const issueJWT = (user) => {
    const _id = user._id
    const expiresIn = Number(process.env.COOKIE_TIMEOUT) || 300 
    const payload = {
        sub: _id,
        iat: Math.floor(Date.now() / 1000)
    }
    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn: expiresIn,
        algorithm: 'RS256'
    })

    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}