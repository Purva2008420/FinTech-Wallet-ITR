import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!username.trim() || !password) {
            setError("Please enter your username and password.");
            return;
        }

        try {
            setLoading(true);

            const result = await loginUser(
                username.trim(),
                password
            );

            if (result.success) {
                navigate("/dashboard");
            } else {
                setError(
                    result.error ||
                    "Invalid username or password."
                );
            }
        } catch (err) {
            console.error(err);
            setError("Unable to sign in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-container">

                {/* Left Branding Section */}
                <div className="auth-brand-panel">

                    <div className="brand-content">

                        <div className="brand-icon">
                            💳
                        </div>

                        <h1>
                            FinTech Vault
                        </h1>

                        <p>
                            Secure digital wallet and
                            intelligent fraud protection.
                        </p>

                        <div className="security-points">

                            <div className="security-item">
                                <span>🔐</span>
                                <div>
                                    <strong>Secure Access</strong>
                                    <small>
                                        Protected authentication
                                    </small>
                                </div>
                            </div>

                            <div className="security-item">
                                <span>🛡️</span>
                                <div>
                                    <strong>Fraud Protection</strong>
                                    <small>
                                        Intelligent transaction monitoring
                                    </small>
                                </div>
                            </div>

                            <div className="security-item">
                                <span>📊</span>
                                <div>
                                    <strong>Financial Insights</strong>
                                    <small>
                                        Track and analyse transactions
                                    </small>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>


                {/* Login Section */}
                <div className="auth-form-panel">

                    <div className="auth-form-wrapper">

                        <div className="mobile-brand">
                            <div className="brand-icon">
                                💳
                            </div>

                            <h2>
                                FinTech Vault
                            </h2>
                        </div>

                        <div className="auth-heading">

                            <span className="welcome-label">
                                WELCOME BACK
                            </span>

                            <h2>
                                Sign in to your account
                            </h2>

                            <p>
                                Access your wallet and manage
                                your financial activity securely.
                            </p>

                        </div>


                        {error && (
                            <div className="auth-alert auth-alert-error">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}


                        <form onSubmit={handleSubmit}>

                            {/* Username */}
                            <div className="auth-field">

                                <label htmlFor="username">
                                    Username
                                </label>

                                <div className="auth-input-wrapper">

                                    <span className="input-icon">
                                        👤
                                    </span>

                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                        disabled={loading}
                                    />

                                </div>

                            </div>


                            {/* Password */}
                            <div className="auth-field">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="auth-input-wrapper">

                                    <span className="input-icon">
                                        🔒
                                    </span>

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={loading}
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        tabIndex="-1"
                                    >
                                        {showPassword
                                            ? "🙈"
                                            : "👁️"}
                                    </button>

                                </div>

                            </div>


                            {/* Sign In */}
                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>

                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <span>→</span>
                                    </>
                                )}

                            </button>

                        </form>


                        <div className="auth-divider">
                            <span>SECURE FINANCIAL ACCESS</span>
                        </div>


                        <p className="auth-switch">

                            Don't have an account?

                            <Link to="/register">
                                Create an account
                            </Link>

                        </p>


                        <div className="auth-footer">

                            <span>🔐 Secure</span>
                            <span>•</span>
                            <span>🛡️ Protected</span>
                            <span>•</span>
                            <span>📊 Trusted</span>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Login;
