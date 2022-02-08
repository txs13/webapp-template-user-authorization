import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = {
    _id: null,
    created: null,
    name: "",
    familyname: "",
    companyname: "",
    position: "",
    portalrole: "",
    rating: 0,
    email: "",
    phone: "",
    address: "",
    description: ""
}

export const userSlice = createSlice({
    name: "user",
    initialState: { value: initialStateValue },
    reducers: {
        
        login: (state, action) => {
            console.log(action.payload)
            const user = action.payload.user
            state.value = {
                _id: user._id,
                created: Date.parse(user.created),
                email: user.email,
                familyname: user.familyname,
                portalrole: user.portalrole,
                rating: user.rating,
                name: user.name ? user.name : "",
                companyname: user.companyname ? user.companyname : "",
                position: user.position ? user.position : "",
                phone: user.phone ? user.phone : "",
                address: user.address ? user.adress : "",
                description: user.description ? user.description : ""
            }
        },

        logout: (state, action) => {
            state.value = initialStateValue
        }

    }
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer