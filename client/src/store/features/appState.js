import { createSlice } from '@reduxjs/toolkit'

export const appStates = {
    WELCOMESCREEN: "WELCOMESCREEN",
    LOGIN: "LOGIN",
    REGISTER: "REGISTER",
    APPMAIN: "APPMAIN",
    ABOUTAPP: "ABOUTAPP",
    PROFILE: "PROFILE",
    SETTINGS: "SETTINGS"
}


const initialStateValue = {
    state: appStates.WELCOMESCREEN
}

export const appStatesSlice = createSlice({
    name: "appState",
    initialState: {value: initialStateValue},
    reducers: {
        changeState: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { changeState } = appStatesSlice.actions

export default appStatesSlice.reducer