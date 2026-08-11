import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="fintech-navbar navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid px-lg-4">

                {/* Brand */}
                <Link
                    to="/dashboard"
                    className="navbar-brand fintech-brand"
                >
                    <div className="brand-icon">
                        💳
                    </div>

                    <div className="brand-text">
                        <span className="brand-title">
                            FinTech Vault
                        </span>

                        <span className="brand-subtitle">
                            Secure Digital Finance
                        </span>
                    </div>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="navbar-toggler fintech-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="mainNavbar"
                >

                    {/* Main Navigation */}
                    <div className="navbar-nav fintech-nav me-auto">

                        <Link
                            to="/dashboard"
                            className={`fintech-nav-link ${
                                isActive("/dashboard")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <span>🏠</span>
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            to="/wallet"
                            className={`fintech-nav-link ${
                                isActive("/wallet")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <span>💳</span>
                            <span>Wallet</span>
                        </Link>

                        <Link
                            to="/transfer"
                            className={`fintech-nav-link ${
                                isActive("/transfer")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <span>💸</span>
                            <span>Transfer</span>
                        </Link>

                        <Link
                            to="/transactions"
                            className={`fintech-nav-link ${
                                isActive("/transactions")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <span>📜</span>
                            <span>Transactions</span>
                        </Link>

                        <Link
                            to="/profile"
                            className={`fintech-nav-link ${
                                isActive("/profile")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <span>👤</span>
                            <span>Profile</span>
                        </Link>

                        {/* Admin Navigation */}
                        {user.is_staff && (
                            <>
                                <div className="nav-divider"></div>

                                <Link
                                    to="/admin"
                                    className={`fintech-nav-link admin-link ${
                                        isActive("/admin")
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <span>🛡️</span>
                                    <span>Admin</span>
                                </Link>

                                <Link
                                    to="/analytics"
                                    className={`fintech-nav-link admin-link ${
                                        isActive("/analytics")
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <span>📊</span>
                                    <span>Analytics</span>
                                </Link>

                                <Link
                                    to="/fraud-review"
                                    className={`fintech-nav-link admin-link ${
                                        isActive("/fraud-review")
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <span>🚨</span>
                                    <span>Fraud Review</span>
                                </Link>
                            </>
                        )}

                    </div>

                    {/* Right Side User Section */}
                    <div className="navbar-user-section">

                        {/* User Profile */}
                        <Link
                            to="/profile"
                            className="user-profile-link"
                        >
                            <div className="user-avatar">
                                {user.username
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="user-details">

                                <span className="user-name">
                                    {user.username}
                                </span>

                                <span className="user-role">
                                    {user.is_staff
                                        ? "Administrator"
                                        : "Standard User"}
                                </span>

                            </div>
                        </Link>

                        {/* Logout */}
                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            <span>↪</span>
                            <span>Logout</span>
                        </button>

                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
