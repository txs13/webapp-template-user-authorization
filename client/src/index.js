import ReactDOM from 'react-dom'
import React from 'react'
import App from './App.js'
import { Provider } from "react-redux"
import { createTheme, CssBaseline } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"

import store from "./store/store.js"
import './index.css'

const appTheme = createTheme()

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={appTheme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root"))