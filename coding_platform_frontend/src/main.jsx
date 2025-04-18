import React from "react"
import ReactDOM from "react-dom/client"
import {BrowserRouter} from "react-router-dom"
import App from "./App.jsx"
import "./index.css"
import {ThemeProvider} from "./components/theme-provider.jsx"
import {AuthProvider} from "@/utils/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <ThemeProvider defaultTheme="light" storageKey="theme">
                    <App/>
                </ThemeProvider>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>,
)

