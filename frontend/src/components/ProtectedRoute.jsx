import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);
    const token = localStorage.getItem("access");

    // Wait until the user profile has been loaded
    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    // No active token → login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Admin-only route
    if (adminOnly && !user?.is_staff) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
