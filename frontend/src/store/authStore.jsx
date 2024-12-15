import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

export const authStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,
    message: null,
    isAuthenticated: false,
    isLoggedin: false,
    isCheckingAuth: false,
    signup: async (email, password, name) => {
        set({ isAuthenticated: false, isLoading: true, error: null, user: null, message: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, {
                email,
                password,
                name,
            });
            set({
                isAuthenticated: true,
                isLoading: false,
                user: response.data.user,
                message: "User created successfully!",
            });
        } catch (error) {
            set({
                error: error.response.data.message || "Error signing up",
                isLoading: false,
            });
            throw error;
        }
    },
    login: async (email, password) => {
        set({ isAuthenticated: false, isLoading: true, error: null, isLoggedin: null, message: null });
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password,
            });
            set({
                isLoggedin: false,
                isLoading: false,
                isAuthenticated: true,
                user: response.data.user,
                message: "Logged in successfully!",
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error logging in",
                isLoading: false,
            });
            throw error;
        }
    },
    googleAuth: async (code) => {
        set({ error: null, isAuthenticated: false, message: null });
        try {
            const response = await axios.post(`http://localhost:5000/api/auth/google?code=${code}`);
            set({
                isAuthenticated: true,
                user: response.data.user,
                error: null,
                message: "Logged in successfully",
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error logging in",
            });
            throw error;
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/logout`);
            set({
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
            });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoggedin: true,
                isCheckingAuth: false,
            });
        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
        }
    },
}));
