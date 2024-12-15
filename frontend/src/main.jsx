import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId="468764831562-ntq5a46pmn7gedjmujnl69vlvaekspsb.apps.googleusercontent.com">
        <StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </StrictMode>
    </GoogleOAuthProvider>
);
