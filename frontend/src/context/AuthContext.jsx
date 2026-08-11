import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loginUser = async (username, password) => {
        try {
            const res = await api.post("accounts/login/", { username, password });
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            await fetchProfile();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || "Invalid credentials" };
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await api.get("accounts/profile/");
            setUser(res.data);
        } catch {
            logoutUser();
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
        setLoading(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) { fetchProfile(); } else { setLoading(false); }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
