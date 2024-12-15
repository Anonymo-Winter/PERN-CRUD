import { create } from "zustand";
import axios from "axios";
const API_URL = "http://localhost:5000/api/crud";

axios.defaults.withCredentials = true;

export const crudStore = create((set) => ({
    isLoading: true,
    data: null,
    error: null,
    message: null,
    fetchData: async (email) => {
        set({ data: null, error: null, isLoading: true, message: null });
        try {
            const response = await axios.post(
                `${API_URL}`,
                { email },
                {
                    withCredentials: true,
                }
            );
            set({ data: response.data.message, isLoading: false });
            return response.data;
        } catch (error) {
            set({
                error: error.response.data.message || "Error occured while fetching data",
                isLoading: false,
            });
            throw error;
        }
    },
    addData: async (formData) => {
        set({ data: null, error: null, message: null, isLoading: true });
        try {
            const response = await axios.post(`${API_URL}/add-data`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set({
                data: response.data,
                error: null,
                message: "Data added successfully",
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error.response.data.message || "Error occured in adding data",
                isLoading: false,
            });
            throw error;
        }
    },
    deleteData: async (id) => {
        set({ data: null, error: null, message: null, isLoading: true });
        try {
            const response = await axios.post(
                `${API_URL}/delete-data`,
                { id },
                {
                    withCredentials: true,
                }
            );
            set({
                data: response.data,
                error: null,
                message: "Data deleted successfully",
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error.response.data.message || "Error occured in deleting data",
                isLoading: false,
            });
            throw error;
        }
    },
    updateData: async (formData) => {
        set({ data: null, error: null, message: null, isLoading: true });
        try {
            const response = await axios.post(`${API_URL}/update-data`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            set({
                data: response.data,
                error: null,
                message: "Data added successfully",
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error.response.data.message || "Error occured in updating data",
                isLoading: false,
            });
            throw error;
        }
    },
}));
