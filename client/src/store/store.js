import { configureStore } from '@reduxjs/toolkit'

import userReducer from './features/user.js'
import appStateReducer from './features/appState.js'

const store = configureStore({
    reducer: {
        user: userReducer,
        appState: appStateReducer,
        
    },
})

export default store