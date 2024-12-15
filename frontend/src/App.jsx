import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";

import Home from "./pages/Home.jsx";
import { authStore } from "./store/authStore.jsx";
import { useEffect } from "react";
const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, isLoggedin } = authStore();
    if (isAuthenticated && isLoggedin) {
        return <Navigate to="/" replace />;
    }
    return children;
};
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = authStore();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};
export default function App() {
    const { checkAuth } = authStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    return (
        <div className="flex p-6 min-h-screen bg-gradient-to-br from-gray-800 via-cyan-500 to-blue-800 items-center justify-center relative overflow-hidden">
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <RedirectAuthenticatedUser>
                            <LoginPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RedirectAuthenticatedUser>
                            <SignupPage />
                        </RedirectAuthenticatedUser>
                    }
                />
            </Routes>
            <Toaster style={{ zIndex: 9999 }} />
        </div>
    );
}
