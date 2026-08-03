import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Step 8 logic: Wipe localStorage keys clean and push to login path
    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    if (!user) return null;

    const isActive = (path) => location.pathname === path ? "active fw-bold text-warning" : "text-white";

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
            <div className="container">
                <Link className="navbar-brand fw-bold text-white" to="/dashboard">💳 FinTech Vault</Link>
                <div className="navbar-nav me-auto flex-row gap-3 ms-4">
                    <Link className={`nav-link ${isActive("/dashboard")}`} to="/dashboard">Dashboard</Link>
                    <Link className={`nav-link ${isActive("/wallet")}`} to="/wallet">Wallet</Link>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <span className="text-white small fw-bold">👤 {user.username}</span>
                    <button className="btn btn-sm btn-outline-light fw-bold" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
