import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String
    },
    familyname: {
        type: String,
        required: true
    },
    companyname: {
        type: String
    },
    position: {
        type: String
    },
    portalrole: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    description: {
        type: String
    }
})

export default mongoose.model('Users', UserSchema)