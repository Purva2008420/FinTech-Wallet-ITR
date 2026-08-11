import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

const Register = () => {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // Basic validation
        if (
            !formData.username.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim() ||
            !formData.password
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        if (formData.phone.length !== 10) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        if (formData.password.length < 8) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }

        try {

            setLoading(true);

            await api.post(
                "accounts/register/",
                formData
            );

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {

            console.error(err);

            const data = err.response?.data;

            if (data?.username?.[0]) {
                setError(data.username[0]);
            } else if (data?.email?.[0]) {
                setError(data.email[0]);
            } else if (data?.phone?.[0]) {
                setError(data.phone[0]);
            } else if (data?.password?.[0]) {
                setError(data.password[0]);
            } else if (data?.detail) {
                setError(data.detail);
            } else {
                setError(
                    "Registration failed. Please check your details and try again."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="auth-page">

            <div className="auth-container">


                {/* Left Branding */}
                <div className="auth-brand-panel">

                    <div className="brand-content">

                        <div className="brand-icon">
                            💳
                        </div>

                        <h1>
                            FinTech Vault
                        </h1>

                        <p>
                            Your secure digital wallet
                            starts here.
                        </p>


                        <div className="registration-benefits">

                            <div className="benefit-item">
                                <span>💰</span>
                                <div>
                                    <strong>
                                        Digital Wallet
                                    </strong>

                                    <small>
                                        Manage your funds securely
                                    </small>
                                </div>
                            </div>


                            <div className="benefit-item">
                                <span>📈</span>
                                <div>
                                    <strong>
                                        Smart Analytics
                                    </strong>

                                    <small>
                                        Understand your transactions
                                    </small>
                                </div>
                            </div>


                            <div className="benefit-item">
                                <span>🚨</span>
                                <div>
                                    <strong>
                                        Fraud Detection
                                    </strong>

                                    <small>
                                        Suspicious activity monitoring
                                    </small>
                                </div>
                            </div>


                            <div className="benefit-item">
                                <span>🔐</span>
                                <div>
                                    <strong>
                                        Account Security
                                    </strong>

                                    <small>
                                        Protected financial access
                                    </small>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>


                {/* Registration Form */}
                <div className="auth-form-panel">

                    <div className="auth-form-wrapper register-wrapper">


                        {/* Mobile Brand */}
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
                                GET STARTED
                            </span>

                            <h2>
                                Create your account
                            </h2>

                            <p>
                                Set up your secure digital wallet
                                in just a few steps.
                            </p>

                        </div>


                        {/* Error */}
                        {error && (

                            <div className="auth-alert auth-alert-error">

                                <span>⚠️</span>

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        {/* Success */}
                        {success && (

                            <div className="auth-alert auth-alert-success">

                                <span>✅</span>

                                <span>
                                    {success}
                                </span>

                            </div>

                        )}


                        <form onSubmit={handleSubmit}>


                            {/* Username */}
                            <div className="auth-field">

                                <label htmlFor="register-username">
                                    Username
                                </label>

                                <div className="auth-input-wrapper">

                                    <span className="input-icon">
                                        👤
                                    </span>

                                    <input
                                        id="register-username"
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Choose a username"
                                        autoComplete="username"
                                        disabled={loading}
                                    />

                                </div>

                            </div>


                            {/* Email */}
                            <div className="auth-field">

                                <label htmlFor="register-email">
                                    Email Address
                                </label>

                                <div className="auth-input-wrapper">

                                    <span className="input-icon">
                                        ✉️
                                    </span>

                                    <input
                                        id="register-email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        disabled={loading}
                                    />

                                </div>

                            </div>


                            {/* Phone */}
                            <div className="auth-field">

                                <label htmlFor="register-phone">
                                    Phone Number
                                </label>

                                <div className="auth-input-wrapper">

                                    <span className="input-icon">
                                        📱
                                    </span>

                                    <input
                                        id="register-phone"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="10-digit phone number"
                                        maxLength="10"
                                        autoComplete="tel"
                                        disabled={loading}
                                    />

                                </div>

                            </div>


                            {/* Password */}
                            <div className="auth-field">

                                <label htmlFor="register-password">
                                    Password
                                </label>

                                <div className="auth-input-wrapper">

                                    <span className="input-icon">
                                        🔒
                                    </span>

                                    <input
                                        id="register-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a secure password"
                                        autoComplete="new-password"
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

                                <small className="password-hint">
                                    Minimum 8 characters
                                </small>

                            </div>


                            {/* Register */}
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

                                        Creating account...
                                    </>

                                ) : (

                                    <>
                                        Create Account
                                        <span>→</span>
                                    </>

                                )}

                            </button>

                        </form>


                        <div className="auth-divider">
                            <span>SECURE ACCOUNT CREATION</span>
                        </div>


                        <p className="auth-switch">

                            Already have an account?

                            <Link to="/login">
                                Sign in
                            </Link>

                        </p>


                        <div className="auth-footer">

                            <span>🔐 Secure</span>
                            <span>•</span>
                            <span>🛡️ Protected</span>
                            <span>•</span>
                            <span>💳 FinTech Vault</span>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
};

export default Register;
