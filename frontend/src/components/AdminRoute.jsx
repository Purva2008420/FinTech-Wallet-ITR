import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const token = localStorage.getItem("access");

    // Not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Wait for user/profile information
    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div
                    className="spinner-border text-primary"
                    role="status"
                ></div>

                <p className="mt-3">
                    Verifying administrator access...
                </p>
            </div>
        );
    }

    // Logged in but not an admin
    if (!user?.is_staff) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default AdminRoute;