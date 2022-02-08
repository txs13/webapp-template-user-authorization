import mongoose from 'mongoose'

const UserRolesSchema = new mongoose.Schema({
    userRole: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        required: true
    }

})

export default mongoose.model('UserRoles', UserRolesSchema)